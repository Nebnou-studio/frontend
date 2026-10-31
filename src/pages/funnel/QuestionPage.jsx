import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFunnel } from '../../context/FunnelContext';
import { Arrow, Check, FieldError, BORDER, FOCUS, MUTED, SURFACE, TEXT, ghostBtn, inputClass } from './funnelUi';

// Values saved in answers.activity (same ids as funnel.q1.options)
const ACTIVITIES = ['commerce', 'restaurant', 'services', 'education', 'health', 'realestate', 'industry', 'other'];
const STEPS = ['activity', 'problem', 'tried'];
// Each step reads its texts from the keys you already have: funnel.q1 / q2 / q3
const QKEY = { activity: 'q1', problem: 'q2', tried: 'q3' };
const SUGGESTIONS = ['s1', 's2', 's3', 's4'];

/* ---------- Big pill option (native radio underneath: keyboard and screen readers just work) ---------- */

function Option({ name, value, label, checked, onChange }) {
  return (
    <label
      className={`flex min-h-[60px] cursor-pointer items-center justify-between gap-4 rounded-full border px-6 py-3 transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-[#1E4DD8] ${
        checked
          ? 'border-[#1E4DD8] bg-[#1E4DD8]/[0.07]'
          : `${BORDER} bg-[var(--bg)] hover:border-[color:var(--text)]`
      }`}
    >
      <input type="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)} className="sr-only" />
      <span className={`font-heading text-[15px] font-semibold ${TEXT}`}>{label}</span>
      <span
        aria-hidden="true"
        className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-colors ${
          checked ? 'border-[#1E4DD8] bg-[#1E4DD8] text-white' : `${BORDER} bg-[var(--surface)]`
        }`}
      >
        {checked && <Check className="h-3.5 w-3.5" />}
      </span>
    </label>
  );
}

/* ---------- Page ---------- */

export default function QuestionPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { answers, updateAnswers } = useFunnel();
  const isRtl = (i18n.language || '').startsWith('ar');
  const total = STEPS.length;

  const stepDone = {
    activity: Boolean(answers.activity) && (answers.activity !== 'other' || answers.activity_other.trim().length > 1),
    problem: answers.problem.trim().length >= 10,
    tried: typeof answers.tried_before === 'boolean',
  };
  const firstOpen = STEPS.findIndex((k) => !stepDone[k]);

  // Start on the first unanswered question (or the last one when coming back from booking)
  const [index, setIndex] = useState(firstOpen === -1 ? total - 1 : firstOpen);
  const [error, setError] = useState('');
  const titleRef = useRef(null);
  const mounted = useRef(false);
  const key = STEPS[index];
  const doneCount = STEPS.filter((k) => stepDone[k]).length;

  // Move focus to the new question title so screen readers follow the step change
  useEffect(() => {
    if (mounted.current) titleRef.current?.focus({ preventScroll: true });
    else mounted.current = true;
  }, [index]);

  const activityLabel =
    answers.activity === 'other'
      ? answers.activity_other.trim()
      : answers.activity
        ? t(`funnel.q1.options.${answers.activity}`)
        : '';

  const summaryValue = (k) => {
    if (!stepDone[k]) return t('funnel.qpanel.pending');
    if (k === 'activity') return activityLabel;
    if (k === 'problem') return answers.problem.trim();
    return t(answers.tried_before ? 'funnel.q3.yes' : 'funnel.q3.no');
  };

  const goNext = (e) => {
    e.preventDefault();
    if (!stepDone[key]) {
      const errors = {
        activity: answers.activity === 'other' ? t('funnel.q1.otherRequired') : t('funnel.q1.required'),
        problem: t('funnel.q2.tooShort'),
        tried: t('funnel.q3.required'),
      };
      setError(errors[key]);
      return;
    }
    setError('');
    if (index < total - 1) setIndex(index + 1);
    else navigate('/start/booking');
  };

  const goBack = () => {
    setError('');
    if (index > 0) setIndex(index - 1);
    else navigate('/start');
  };

  const pickActivity = (value) => {
    setError('');
    updateAnswers({ activity: value, ...(value !== 'other' ? { activity_other: '' } : {}) });
  };

  const pickTried = (value) => {
    setError('');
    updateAnswers({ tried_before: value === 'yes', ...(value === 'no' ? { tried_details: '' } : {}) });
  };

  const remaining = total - (index + 1);
  const textarea = `${inputClass(Boolean(error))} !rounded-2xl min-h-[150px] resize-y leading-relaxed`;

  return (
    <section aria-labelledby="q-title" className="mx-auto max-w-[1100px]">
      <div className={`grid overflow-hidden rounded-[32px] border lg:grid-cols-12 ${BORDER} ${SURFACE}`}>
        {/* ---------- Left: project summary (desktop only) ---------- */}
        <aside className="relative hidden flex-col overflow-hidden bg-[#1E4DD8]/[0.06] p-8 lg:col-span-5 lg:flex xl:p-10 dark:bg-[#FFF7EE]/[0.04]">
          <svg viewBox="0 0 120 120" aria-hidden="true" className="pointer-events-none absolute -bottom-10 -end-10 h-56 w-56 opacity-[0.1]">
            <rect width="38" height="120" rx="14" fill="#1E4DD8" />
            <rect x="44" width="76" height="38" rx="14" fill="#FF7A3D" />
            <rect x="82" y="44" width="38" height="76" rx="14" className="fill-[#1B1F2A] dark:fill-[#FFF7EE]" />
          </svg>

          <div className="relative flex items-center gap-3">
            <span aria-hidden="true" className="grid h-9 w-9 place-items-center rounded-full bg-[#1E4DD8]/15 text-[#1E4DD8] dark:text-[#8FB0FF]">
              <Arrow glyph="↗" />
            </span>
            <span className={`font-heading text-xs font-semibold tracking-[0.06em] ${TEXT} ${isRtl ? '' : 'uppercase'}`}>
              {t('funnel.qpanel.crumb')}
              {activityLabel ? ` / ${activityLabel}` : ''}
            </span>
          </div>

          <h1
            id="q-title-side"
            style={{ lineHeight: isRtl ? '1.4' : '1.12' }}
            className={`relative mt-12 font-heading text-[34px] font-bold tracking-tight ${TEXT}`}
          >
            {t('funnel.qpanel.title')}
          </h1>
          <p className={`relative mt-4 max-w-[34ch] text-base leading-relaxed ${MUTED}`}>{t('funnel.qpanel.subtitle')}</p>

          <div className="relative mt-10">
            <div className={`flex items-center justify-between border-b pb-3 font-heading text-sm font-semibold ${BORDER} ${TEXT}`}>
              <span>{t('funnel.qpanel.progressLabel')}</span>
              <span dir="ltr" className={MUTED}>
                {doneCount}/{total}
              </span>
            </div>

            <ol>
              {STEPS.map((k, i) => {
                const done = stepDone[k];
                const active = i === index;
                return (
                  <li key={k} className={`flex items-center gap-4 border-b py-4 ${BORDER}`}>
                    <span
                      aria-hidden="true"
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border font-heading text-xs font-bold ${
                        done
                          ? 'border-[#1E4DD8] bg-[#1E4DD8] text-white'
                          : active
                            ? `border-[#1E4DD8] ${TEXT} ring-4 ring-[#1E4DD8]/15`
                            : `${BORDER} ${MUTED}`
                      }`}
                    >
                      {done ? <Check className="h-4 w-4" /> : String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`block text-xs ${MUTED}`}>{t(`funnel.qpanel.labels.${k}`)}</span>
                      <span className={`block truncate font-heading text-sm font-semibold ${done ? TEXT : MUTED}`}>{summaryValue(k)}</span>
                    </span>
                    {done && (
                      <button
                        type="button"
                        onClick={() => {
                          setError('');
                          setIndex(i);
                        }}
                        aria-label={t('funnel.qpanel.edit', { step: t(`funnel.qpanel.labels.${k}`) })}
                        className={`grid h-8 w-8 place-items-center rounded-full ${MUTED} hover:text-[color:var(--text)] ${FOCUS}`}
                      >
                        <Arrow glyph="↗" />
                      </button>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>

          <p className={`relative mt-auto flex items-center gap-3 pt-8 text-xs ${MUTED}`}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            {t('funnel.qpanel.reassure')}
          </p>
        </aside>

        {/* ---------- Right: one question at a time ---------- */}
        <form onSubmit={goNext} noValidate className="flex flex-col p-5 sm:p-8 lg:col-span-7 xl:p-10">
          <div className="flex items-center justify-between gap-4 text-sm">
            <p className={MUTED}>
              {t('funnel.stepOf', { current: index + 1, total })}
            </p>
            <p className="font-heading text-[13px] font-semibold text-[#1E4DD8] dark:text-[#8FB0FF]">
              {remaining > 0 ? t('funnel.qpanel.remaining', { n: remaining }) : t('funnel.qpanel.lastOne')}
            </p>
          </div>

          <div
            className="mt-3 grid grid-cols-3 gap-2"
            role="progressbar"
            aria-label={t('funnel.q.counter', { n: index + 1, total })}
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={index + 1}
          >
            {STEPS.map((k, i) => (
              <span key={k} className="h-1.5 overflow-hidden rounded-full bg-[var(--border)]">
                <span
                  className="block h-full rounded-full bg-[#1E4DD8] transition-[width] duration-300 motion-reduce:transition-none"
                  style={{ width: i < index ? '100%' : i === index ? '40%' : '0%' }}
                />
              </span>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-3">
            <span aria-hidden="true" className="grid h-7 w-7 place-items-center rounded-full bg-[#1E4DD8] font-heading text-xs font-bold text-white">
              {index + 1}
            </span>
            <span className="font-heading text-[13px] font-semibold text-[#1E4DD8] dark:text-[#8FB0FF]">
              {t(`funnel.qpanel.labels.${key}`)}
            </span>
          </div>

          <h2
            id="q-title"
            ref={titleRef}
            tabIndex={-1}
            style={{ lineHeight: isRtl ? '1.4' : '1.15' }}
            className={`mt-4 max-w-[20ch] font-heading text-[28px] font-bold tracking-tight outline-none sm:text-[36px] ${TEXT}`}
          >
            {t(`funnel.${QKEY[key]}.title`)}
          </h2>
          <p className={`mt-3 text-base leading-relaxed ${MUTED}`}>{t(`funnel.${QKEY[key]}.hint`)}</p>

          <div className="mt-7 min-h-[260px]">
            {key === 'activity' && (
              <>
                <div role="radiogroup" aria-labelledby="q-title" className="grid gap-3 sm:grid-cols-2">
                  {ACTIVITIES.map((value) => (
                    <Option
                      key={value}
                      name="activity"
                      value={value}
                      label={t(`funnel.q1.options.${value}`)}
                      checked={answers.activity === value}
                      onChange={pickActivity}
                    />
                  ))}
                </div>
                {answers.activity === 'other' && (
                  <div className="mt-4">
                    <label htmlFor="q-other" className={`mb-2 block text-sm font-semibold ${TEXT}`}>
                      {t('funnel.q1.otherLabel')}
                    </label>
                    <input
                      id="q-other"
                      type="text"
                      value={answers.activity_other}
                      onChange={(e) => {
                        setError('');
                        updateAnswers({ activity_other: e.target.value });
                      }}
                      placeholder={t('funnel.q1.otherPlaceholder')}
                      aria-invalid={Boolean(error)}
                      className={`${inputClass(Boolean(error))} !rounded-full px-6`}
                    />
                  </div>
                )}
              </>
            )}

            {key === 'problem' && (
              <>
                <label htmlFor="q-problem" className="sr-only">
                  {t('funnel.q2.title')}
                </label>
                <textarea
                  id="q-problem"
                  rows={5}
                  value={answers.problem}
                  onChange={(e) => {
                    setError('');
                    updateAnswers({ problem: e.target.value });
                  }}
                  placeholder={t('funnel.q2.placeholder')}
                  aria-invalid={Boolean(error)}
                  className={textarea}
                />
                <p className={`mb-2 mt-4 text-sm font-semibold ${TEXT}`}>{t('funnel.q2.suggestionsLabel')}</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((sKey) => {
                    const text = t(`funnel.q2.suggestions.${sKey}`);
                    return (
                      <button
                        key={sKey}
                        type="button"
                        onClick={() => {
                          setError('');
                          updateAnswers({ problem: answers.problem.trim() ? `${answers.problem.trim()}. ${text}` : text });
                        }}
                        className={`rounded-full border px-4 py-2 text-left text-sm font-medium transition-colors hover:border-[color:var(--text)] ${BORDER} ${TEXT} ${FOCUS}`}
                      >
                        {text}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {key === 'tried' && (
              <>
                <div role="radiogroup" aria-labelledby="q-title" className="grid gap-3 sm:grid-cols-2">
                  <Option
                    name="tried"
                    value="yes"
                    label={t('funnel.q3.yes')}
                    checked={answers.tried_before === true}
                    onChange={pickTried}
                  />
                  <Option
                    name="tried"
                    value="no"
                    label={t('funnel.q3.no')}
                    checked={answers.tried_before === false}
                    onChange={pickTried}
                  />
                </div>
                {answers.tried_before === true && (
                  <div className="mt-4">
                    <label htmlFor="q-tried" className={`mb-2 block text-sm font-semibold ${TEXT}`}>
                      {t('funnel.q3.detailsLabel')}
                    </label>
                    <textarea
                      id="q-tried"
                      rows={3}
                      value={answers.tried_details}
                      onChange={(e) => updateAnswers({ tried_details: e.target.value })}
                      placeholder={t('funnel.q3.detailsPlaceholder')}
                      className={`${inputClass(false)} !rounded-2xl resize-y leading-relaxed`}
                    />
                  </div>
                )}
              </>
            )}

            <FieldError id="q-error">{error}</FieldError>
          </div>

          <div className={`mt-6 flex items-center justify-between gap-4 border-t pt-5 ${BORDER}`}>
            <button type="button" onClick={goBack} className={ghostBtn}>
              <Arrow glyph="←" />
              {t('funnel.q.back')}
            </button>

            <button
              type="submit"
              className={`inline-flex items-center gap-4 rounded-full bg-[#1B1F2A] py-2 ps-7 pe-2 font-heading text-[15px] font-semibold text-[#FFF7EE] transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:transform-none dark:bg-[#FFF7EE] dark:text-[#1B1F2A] ${FOCUS}`}
            >
              {index === total - 1 ? t('funnel.q.finish') : t('funnel.q.next')}
              <span className="grid h-11 w-11 place-items-center rounded-full bg-[#FF7A3D] text-[#1B1F2A]">
                <Arrow />
              </span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}