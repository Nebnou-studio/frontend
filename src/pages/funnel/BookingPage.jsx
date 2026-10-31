import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFunnel } from '../../context/FunnelContext';
import {
  BOOKING_WINDOW_DAYS,
  addDays,
  algiersToday,
  createBooking,
  getAvailableDays,
  getSlots,
  pad,
} from '../../services/funnelService';
import { Arrow, FieldError, BORDER, ERROR, FOCUS, MUTED, SURFACE, TEXT, inputClass, primaryBtn } from './funnelUi';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Accepts 0555..., +213555..., 00213555... and returns +213XXXXXXXXX (or null)
const normalizePhone = (raw) => {
  const cleaned = raw.replace(/[\s.\-()]/g, '');
  const match = cleaned.match(/^(?:\+213|00213|0)([567]\d{8})$/);
  return match ? `+213${match[1]}` : null;
};

const card = `rounded-[24px] border p-5 sm:p-6 ${BORDER} ${SURFACE}`;

/* ---------- Month calendar (Sunday first, like the availability table) ---------- */

function Calendar({ view, setView, today, last, availableDays, selected, onSelect, loc, t }) {
  const [ty, tm] = today.split('-').map(Number);
  const [ly, lm] = last.split('-').map(Number);
  const monthIndex = view.y * 12 + view.m;
  const canPrev = monthIndex > ty * 12 + (tm - 1);
  const canNext = monthIndex < ly * 12 + (lm - 1);

  const first = new Date(Date.UTC(view.y, view.m, 1));
  const offset = first.getUTCDay();
  const daysInMonth = new Date(Date.UTC(view.y, view.m + 1, 0)).getUTCDate();
  const monthLabel = new Intl.DateTimeFormat(loc, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(first);
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(loc, { weekday: 'short', timeZone: 'UTC' }).format(new Date(Date.UTC(2026, 10, 1 + i)))
  );

  const move = (delta) => {
    const d = new Date(Date.UTC(view.y, view.m + delta, 1));
    setView({ y: d.getUTCFullYear(), m: d.getUTCMonth() });
  };

  const navBtn = `flex h-10 w-10 items-center justify-center rounded-full border transition-colors enabled:hover:border-[color:var(--text)] disabled:cursor-not-allowed disabled:opacity-35 ${BORDER} ${TEXT} ${FOCUS}`;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button type="button" onClick={() => move(-1)} disabled={!canPrev} aria-label={t('funnel.booking.prevMonth')} className={navBtn}>
          <Arrow glyph="←" />
        </button>
        <p className={`font-heading text-base font-semibold capitalize ${TEXT}`} aria-live="polite">
          {monthLabel}
        </p>
        <button type="button" onClick={() => move(1)} disabled={!canNext} aria-label={t('funnel.booking.nextMonth')} className={navBtn}>
          <Arrow glyph="→" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center">
        {weekdays.map((w, i) => (
          <span key={i} className={`pb-1 text-xs font-semibold ${MUTED}`}>
            {w}
          </span>
        ))}

        {Array.from({ length: offset }, (_, i) => (
          <span key={`blank-${i}`} aria-hidden="true" />
        ))}

        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const ds = `${view.y}-${pad(view.m + 1)}-${pad(day)}`;
          const inWindow = ds >= today && ds <= last;
          const enabled = inWindow && (!availableDays || availableDays.includes(ds));
          const isSelected = selected === ds;
          const label = new Intl.DateTimeFormat(loc, { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(
            new Date(Date.UTC(view.y, view.m, day))
          );
          return (
            <button
              key={ds}
              type="button"
              disabled={!enabled}
              aria-pressed={isSelected}
              aria-label={label}
              onClick={() => onSelect(ds)}
              className={`aspect-square rounded-xl text-sm font-semibold transition-colors ${FOCUS} ${
                isSelected
                  ? 'bg-[var(--text)] text-[color:var(--bg)]'
                  : enabled
                    ? `${availableDays ? 'bg-[#FF7A3D]/15' : ''} ${TEXT} hover:bg-[#FF7A3D]/30`
                    : `cursor-not-allowed opacity-35 ${MUTED}`
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Page ---------- */

export default function BookingPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { answers, setBooking } = useFunnel();
  const isRtl = (i18n.language || '').startsWith('ar');
  const loc = isRtl ? 'ar-DZ-u-nu-latn' : 'fr-FR'; // Latin digits in Arabic

  const today = useMemo(() => algiersToday(), []);
  const last = useMemo(() => addDays(today, BOOKING_WINDOW_DAYS), [today]);
  const [ty, tm] = today.split('-').map(Number);

  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [trap, setTrap] = useState(''); // honeypot field, real visitors never fill it
  const [errors, setErrors] = useState({});
  const [view, setView] = useState({ y: ty, m: tm - 1 });
  const [availableDays, setAvailableDays] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [slots, setSlots] = useState([]);
  const [slotsStatus, setSlotsStatus] = useState('idle'); // idle | loading | ready | error
  const [slotsVersion, setSlotsVersion] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const fmtDay = (ds) =>
    new Intl.DateTimeFormat(loc, { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(`${ds}T00:00:00Z`));
  const fmtWhen = (iso) =>
    new Intl.DateTimeFormat(loc, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Africa/Algiers',
    }).format(new Date(iso));

  // Which days still have free slots, and open the first one
  useEffect(() => {
    let cancelled = false;
    getAvailableDays(today, last).then((days) => {
      if (cancelled) return;
      setAvailableDays(days);
      if (days && days.length) {
        setSelectedDate((prev) => prev || days[0]);
        const [y, m] = days[0].split('-').map(Number);
        setView({ y, m: m - 1 });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [today, last]);

  // Free slots of the selected day
  useEffect(() => {
    if (!selectedDate) return undefined;
    let cancelled = false;
    setSlotsStatus('loading');
    setSelectedSlot(null);
    getSlots(selectedDate)
      .then((result) => {
        if (cancelled) return;
        setSlots(result);
        setSlotsStatus('ready');
      })
      .catch(() => {
        if (cancelled) return;
        setSlots([]);
        setSlotsStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [selectedDate, slotsVersion]);

  const setField = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = t('funnel.booking.name.error');
    if (!normalizePhone(form.phone)) next.phone = t('funnel.booking.phone.error');
    if (!EMAIL_RE.test(form.email.trim())) next.email = t('funnel.booking.email.error');
    if (!selectedSlot) next.slot = t('funnel.booking.slotRequired');
    return next;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (trap) return; // a bot filled the hidden field
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) {
      const firstField = ['name', 'phone', 'email'].find((k) => found[k]);
      if (firstField) document.getElementById(`bk-${firstField}`)?.focus();
      else document.getElementById('bk-slots')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    try {
      const result = await createBooking({
        name: form.name.trim(),
        phone: normalizePhone(form.phone),
        email: form.email.trim(),
        answers,
        start_at: selectedSlot.start_at,
        locale: isRtl ? 'ar' : 'fr',
      });
      setBooking({ name: form.name.trim(), start_at: result?.meeting?.start_at || selectedSlot.start_at });
      navigate('/start/done');
    } catch (err) {
      if (err.code === 'SLOT_TAKEN') {
        setSubmitError(t('funnel.booking.slotTaken'));
        setSelectedSlot(null);
        setSlotsVersion((v) => v + 1); // reload the free slots
      } else {
        setSubmitError(t('funnel.booking.genericError'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const Field = ({ id, name, type = 'text', autoComplete, ltr }) => (
    <div>
      <label htmlFor={id} className={`mb-2 block text-sm font-semibold ${TEXT}`}>
        {t(`funnel.booking.${name}.label`)}
      </label>
      <input
        id={id}
        type={type}
        inputMode={type === 'tel' ? 'tel' : undefined}
        autoComplete={autoComplete}
        dir={ltr ? 'ltr' : undefined}
        value={form[name]}
        onChange={setField(name)}
        placeholder={t(`funnel.booking.${name}.placeholder`)}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `${id}-error` : undefined}
        className={inputClass(Boolean(errors[name]))}
      />
      <FieldError id={`${id}-error`}>{errors[name]}</FieldError>
    </div>
  );

  return (
    <section aria-labelledby="bk-title" className="mx-auto max-w-[1000px]">
      <div className="mb-8 text-center lg:text-start">
        <h1
          id="bk-title"
          style={{ lineHeight: isRtl ? '1.4' : '1.12' }}
          className={`font-heading text-[30px] font-bold tracking-tight sm:text-[42px] ${TEXT}`}
        >
          {t('funnel.booking.title')}
        </h1>
        <p className={`mt-3 text-base leading-relaxed sm:text-lg ${MUTED}`}>{t('funnel.booking.subtitle')}</p>
      </div>

      <form onSubmit={onSubmit} noValidate>
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Contact details */}
          <div className={`${card} lg:col-span-5`}>
            <h2 className={`mb-5 font-heading text-lg font-semibold ${TEXT}`}>{t('funnel.booking.contactTitle')}</h2>
            <div className="space-y-5">
              {Field({ id: 'bk-name', name: 'name', autoComplete: 'name' })}
              {Field({ id: 'bk-phone', name: 'phone', type: 'tel', autoComplete: 'tel', ltr: true })}
              {Field({ id: 'bk-email', name: 'email', type: 'email', autoComplete: 'email', ltr: true })}
            </div>

            {/* Honeypot: hidden from people, bots tend to fill it */}
            <div aria-hidden="true" className="absolute -start-[9999px] h-0 w-0 overflow-hidden opacity-0">
              <input type="text" name="website" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
            </div>

            <p className={`mt-5 text-xs leading-relaxed ${MUTED}`}>{t('funnel.booking.privacy')}</p>
          </div>

          {/* Calendar and time slots */}
          <div className={`${card} lg:col-span-7`}>
            <h2 className={`mb-5 font-heading text-lg font-semibold ${TEXT}`}>{t('funnel.booking.calendarTitle')}</h2>

            <Calendar
              view={view}
              setView={setView}
              today={today}
              last={last}
              availableDays={availableDays}
              selected={selectedDate}
              onSelect={setSelectedDate}
              loc={loc}
              t={t}
            />

            <div id="bk-slots" tabIndex={-1} className={`mt-6 border-t pt-5 outline-none ${BORDER}`}>
              <p className={`mb-3 font-heading text-sm font-semibold capitalize ${TEXT}`}>
                {selectedDate ? t('funnel.booking.slotsFor', { date: fmtDay(selectedDate) }) : t('funnel.booking.pickDay')}
              </p>

              {slotsStatus === 'loading' && (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4" aria-label={t('funnel.booking.loadingSlots')}>
                  {Array.from({ length: 8 }, (_, i) => (
                    <span key={i} className="h-11 animate-pulse rounded-xl bg-[var(--border)] motion-reduce:animate-none" />
                  ))}
                </div>
              )}

              {slotsStatus === 'ready' && slots.length === 0 && (
                <p className={`text-sm ${MUTED}`}>{t('funnel.booking.noSlots')}</p>
              )}

              {slotsStatus === 'error' && (
                <div className="flex flex-wrap items-center gap-3">
                  <p className={`text-sm font-medium ${ERROR}`}>{t('funnel.booking.genericError')}</p>
                  <button
                    type="button"
                    onClick={() => setSlotsVersion((v) => v + 1)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold ${BORDER} ${TEXT} ${FOCUS}`}
                  >
                    {t('funnel.booking.retry')}
                  </button>
                </div>
              )}

              {slotsStatus === 'ready' && slots.length > 0 && (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4" role="group" aria-label={t('funnel.booking.slotsFor', { date: fmtDay(selectedDate) })}>
                  {slots.map((slot) => {
                    const active = selectedSlot?.start_at === slot.start_at;
                    return (
                      <button
                        key={slot.start_at}
                        type="button"
                        aria-pressed={active}
                        onClick={() => {
                          setSelectedSlot(slot);
                          setErrors((er) => ({ ...er, slot: undefined }));
                        }}
                        dir="ltr"
                        className={`h-11 rounded-xl border text-sm font-semibold transition-colors ${FOCUS} ${
                          active
                            ? 'border-[#FF7A3D] bg-[#FF7A3D] text-[#1B1F2A]'
                            : `${BORDER} ${TEXT} hover:border-[color:var(--text)]`
                        }`}
                      >
                        {slot.label}
                      </button>
                    );
                  })}
                </div>
              )}

              <FieldError>{errors.slot}</FieldError>
              <p className={`mt-3 text-xs ${MUTED}`}>{t('funnel.booking.timezoneNote')}</p>
            </div>
          </div>
        </div>

        {/* Summary and confirmation */}
        <div className={`${card} mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between`}>
          <div>
            <p className={`text-xs font-semibold uppercase tracking-wider ${MUTED}`}>{t('funnel.booking.selected')}</p>
            <p className={`mt-1 font-heading text-lg font-semibold capitalize ${TEXT}`}>
              {selectedSlot ? `${fmtWhen(selectedSlot.start_at)} · ${t('funnel.booking.tzShort')}` : '—'}
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <button type="submit" disabled={submitting} className={primaryBtn}>
              {submitting ? t('funnel.booking.confirming') : t('funnel.booking.confirm')}
              {!submitting && <Arrow />}
            </button>
            <span className={`text-xs ${MUTED}`}>{t('funnel.booking.reassure')}</span>
          </div>
        </div>

        <FieldError>{submitError}</FieldError>
      </form>
    </section>
  );
}