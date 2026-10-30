import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Right column of the Hero — an animated phone that tells the whole service
 * in 3 scenes, on a loop:
 *   1. Tell us      – pick your business type (Restaurant), type your name
 *   2. We build     – a site assembles itself, checklist ticks off
 *   3. You launch   – the site goes live, first customer message arrives
 *
 * - Tabs under the phone let visitors jump to any scene (and show timing).
 * - Autoplay pauses on hover / focus, and is off for prefers-reduced-motion.
 * - Logical props (start/end, ms/me) so it mirrors in RTL.
 * - All text uses t() with a defaultValue, so it works before you add keys.
 */

const STEP_MS = 4200;
const DISH_BG = ['bg-[#FFD9C4]', 'bg-[#EADFD2]', 'bg-[#FFE9A8]'];

export const HeroVisual = () => {
  const { t, i18n } = useTranslation();
  const isRtl = (i18n.language || '').startsWith('ar');
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => {
      setReduced(mq.matches);
      if (mq.matches) setStep(2); // show the end result, no motion
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    if (paused || reduced) return undefined;
    const id = setTimeout(() => setStep((s) => (s + 1) % 3), STEP_MS);
    return () => clearTimeout(id);
  }, [step, paused, reduced]);

  const tabs = [
    t('hero.visual.tab1', { defaultValue: 'Tell us' }),
    t('hero.visual.tab2', { defaultValue: 'We build' }),
    t('hero.visual.tab3', { defaultValue: 'You launch' }),
  ];

  const sectors = [
    t('hero.visual.sector1', { defaultValue: 'Restaurant' }),
    t('hero.visual.sector2', { defaultValue: 'Bakery' }),
    t('hero.visual.sector3', { defaultValue: 'Clinic' }),
    t('hero.visual.sector4', { defaultValue: 'Shop' }),
  ];

  const dishes = [
    t('hero.visual.dish1', { defaultValue: 'Couscous' }),
    t('hero.visual.dish2', { defaultValue: 'Chorba' }),
    t('hero.visual.dish3', { defaultValue: 'Rechta' }),
  ];

  const checks = [
    t('hero.visual.check1', { defaultValue: 'Online menu' }),
    t('hero.visual.check2', { defaultValue: 'Table booking' }),
    t('hero.visual.check3', { defaultValue: 'Mobile ready' }),
    t('hero.visual.check4', { defaultValue: 'Google ready' }),
  ];

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`relative w-full max-w-[400px] mx-auto py-6 ${isRtl ? 'hv-rtl' : ''}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <style>{`
        @keyframes hv-in   { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: none } }
        @keyframes hv-pop  { 0% { opacity: 0; transform: scale(.6) } 70% { transform: scale(1.08) } 100% { opacity: 1; transform: none } }
        @keyframes hv-type { from { clip-path: inset(0 100% 0 0) } to { clip-path: inset(0 0 0 0) } }
        @keyframes hv-fill { from { transform: scaleX(0) } to { transform: scaleX(1) } }
        @keyframes hv-toast{ 0% { opacity: 0; transform: translateY(-16px) } 100% { opacity: 1; transform: none } }
        .hv-in   { animation: hv-in .5s cubic-bezier(.2,.7,.2,1) both; }
        .hv-pop  { animation: hv-pop .45s ease-out both; }
        .hv-type { animation: hv-type 1s steps(12) both; }
        .hv-fill { transform-origin: left; animation: hv-fill ${STEP_MS}ms linear both; }
        @keyframes hv-type-rtl { from { clip-path: inset(0 0 0 100%) } to { clip-path: inset(0 0 0 0) } }
        .hv-rtl .hv-fill { transform-origin: right; }
        .hv-rtl .hv-type { animation-name: hv-type-rtl; }
        .hv-toast{ animation: hv-toast .5s ease-out both; }
        @media (prefers-reduced-motion: reduce) {
          .hv-in, .hv-pop, .hv-type, .hv-fill, .hv-toast { animation: none; }
        }
      `}</style>

      {/* Backdrop */}
      <div className="absolute inset-x-8 top-10 bottom-16 rounded-[48px] bg-[#EADFD2]/60" aria-hidden="true" />
      <div className="absolute -top-1 end-4 w-24 h-24 rounded-full bg-[#FF7A3D]/15" aria-hidden="true" />

      {/* ---------- Phone ---------- */}
      <div className="relative mx-auto w-[250px] sm:w-[270px] rounded-[40px] bg-[#1B1F2A] p-[9px] shadow-[0_30px_60px_-20px_rgba(27,31,42,0.5)]">
        <div className="absolute top-[15px] left-1/2 -translate-x-1/2 w-[72px] h-[20px] rounded-full bg-black z-20" aria-hidden="true" />

        <div
          className="relative overflow-hidden rounded-[32px] bg-[#FBF7F2] aspect-[9/18.5] text-start"
          aria-live="polite"
        >
          {/* Status bar */}
          <div className="flex items-center justify-between px-6 pt-3 text-[10px] font-semibold text-[#1B1F2A]" dir="ltr" aria-hidden="true">
            <span>9:41</span>
            <span className="flex gap-1 items-center">
              <i className="block w-3 h-[6px] rounded-sm bg-[#1B1F2A]" />
              <i className="block w-4 h-[7px] rounded-sm border border-[#1B1F2A]" />
            </span>
          </div>

          {/* ===== Scene 1: Tell us ===== */}
          {step === 0 && (
            <div key="s1" className="absolute inset-0 px-4 pt-14">
              <p className="hv-in text-[17px] leading-snug font-heading font-bold text-[#1B1F2A]">
                {t('hero.visual.s1Title', { defaultValue: 'What kind of business do you run?' })}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {sectors.map((s, i) => {
                  const chosen = i === 0; // Restaurant
                  return (
                    <span
                      key={s}
                      style={{ animationDelay: `${150 + i * 90}ms` }}
                      className={`hv-in rounded-full border px-3 py-1.5 text-[11px] font-semibold ${
                        chosen
                          ? 'border-[#1E4DD8] bg-[#1E4DD8] text-white'
                          : 'border-[#EADFD2] bg-white text-[#1B1F2A]'
                      }`}
                    >
                      {s}
                    </span>
                  );
                })}
              </div>

              <p className="hv-in mt-6 text-[11px] text-[#6B7280]" style={{ animationDelay: '500ms' }}>
                {t('hero.visual.s1Label', { defaultValue: 'Business name' })}
              </p>
              <div className="hv-in mt-1 rounded-xl border border-[#1E4DD8] bg-white px-3 py-2.5" style={{ animationDelay: '550ms' }}>
                <span className="hv-type inline-block text-[13px] font-semibold text-[#1B1F2A]" style={{ animationDelay: '1000ms' }}>
                  {t('hero.visual.s1Name', { defaultValue: 'Nour Restaurant' })}
                </span>
              </div>

              <div className="hv-in absolute inset-x-4 bottom-5 rounded-full bg-[#FF7A3D] py-3 text-center text-[12px] font-bold text-white" style={{ animationDelay: '900ms' }}>
                {t('hero.visual.s1Cta', { defaultValue: 'Build my website' })}
              </div>
            </div>
          )}

          {/* ===== Scene 2: We build ===== */}
          {step === 1 && (
            <div key="s2" className="absolute inset-0 px-4 pt-14">
              <p className="hv-in text-[17px] leading-snug font-heading font-bold text-[#1B1F2A]">
                {t('hero.visual.s2Title', { defaultValue: 'Building your website' })}
              </p>

              {/* Wireframe assembling */}
              <div className="mt-4 rounded-2xl border border-[#EADFD2] bg-white p-3 space-y-2">
                <div className="hv-in h-3 w-1/2 rounded bg-[#1B1F2A]" style={{ animationDelay: '100ms' }} />
                <div className="hv-in h-16 rounded-xl bg-[#1E4DD8]" style={{ animationDelay: '500ms' }} />
                <div className="hv-in grid grid-cols-3 gap-2" style={{ animationDelay: '900ms' }}>
                  {DISH_BG.map((bg) => (
                    <div key={bg} className={`flex h-10 items-center justify-center rounded-lg ${bg}`}>
                      <span className="h-5 w-5 rounded-full bg-white/70" />
                    </div>
                  ))}
                </div>
                <div className="hv-in h-6 rounded-full bg-[#FF7A3D]" style={{ animationDelay: '1300ms' }} />
              </div>

              {/* Checklist */}
              <ul className="mt-4 space-y-2">
                {checks.map((c, i) => (
                  <li
                    key={c}
                    className="hv-in flex items-center gap-2.5 text-[12px] font-semibold text-[#1B1F2A]"
                    style={{ animationDelay: `${600 + i * 650}ms` }}
                  >
                    <span
                      className="hv-pop flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#3DDC84] text-[#1B1F2A]"
                      style={{ animationDelay: `${800 + i * 650}ms` }}
                      aria-hidden="true"
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5 9-10" /></svg>
                    </span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ===== Scene 3: You launch ===== */}
          {step === 2 && (
            <div key="s3" className="absolute inset-0 px-3 pt-10">
              {/* Customer message toast */}
              <div className="hv-toast absolute inset-x-3 top-9 z-10 flex items-center gap-2.5 rounded-2xl bg-[#1B1F2A] px-3 py-2.5 text-white shadow-lg" style={{ animationDelay: '1400ms' }}>
                <span className="flex w-7 h-7 shrink-0 items-center justify-center rounded-full bg-[#3DDC84] text-[#1B1F2A]" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16v12H8l-4 4z" /></svg>
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold leading-tight">{t('hero.visual.toast', { defaultValue: 'New booking' })}</p>
                  <p className="text-[10px] text-white/70 truncate">{t('hero.visual.toastBody', { defaultValue: 'Table for 4 · tonight, 8 pm' })}</p>
                </div>
              </div>

              {/* Live site */}
              <div className="mt-8 rounded-2xl bg-white border border-[#EADFD2] overflow-hidden">
                <div className="flex items-center gap-2 px-3 py-2 border-b border-[#EADFD2]" dir="ltr">
                  <span className="w-2 h-2 rounded-full bg-[#3DDC84]" aria-hidden="true" />
                  <span className="text-[10px] font-semibold text-[#6B7280]">{t('hero.visual.siteDomain', { defaultValue: 'restaurant-nour.dz' })}</span>
                  <span className="ms-auto rounded-full bg-[#3DDC84]/20 px-2 py-0.5 text-[9px] font-bold text-[#0F7A3C]">
                    {t('hero.visual.live', { defaultValue: 'Live' })}
                  </span>
                </div>
                <div className="p-3">
                  <div className="relative overflow-hidden rounded-xl bg-[#1E4DD8] p-3.5 text-white">
                    <div className="absolute -end-5 -bottom-5 w-20 h-20 rounded-full bg-[#FF7A3D]" aria-hidden="true" />
                    <p className="relative max-w-[7.5rem] text-[14px] leading-tight font-heading font-bold">{t('hero.visual.siteHeadline', { defaultValue: 'Your table, booked in a tap' })}</p>
                    <span className="relative mt-2.5 inline-block rounded-full bg-white px-3 py-1 text-[10px] font-bold text-[#1B1F2A]">{t('hero.visual.siteBtn', { defaultValue: 'Book now' })}</span>
                  </div>
                  <div className="mt-2.5 grid grid-cols-3 gap-2" aria-hidden="true">
                    {dishes.map((dish, i) => (
                      <div key={dish} className={`flex h-12 flex-col items-center justify-center gap-1 rounded-lg ${DISH_BG[i]}`}>
                        <span className="h-4 w-4 rounded-full bg-white/80" />
                        <span className="text-[9px] font-semibold leading-none text-[#1B1F2A]">{dish}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <p className="hv-in mt-4 px-1 text-[15px] leading-snug font-heading font-bold text-[#1B1F2A]" style={{ animationDelay: '300ms' }}>
                {t('hero.visual.s3Title', { defaultValue: 'Your website is live. Customers book online.' })}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ---------- Scene tabs ---------- */}
      <div role="tablist" aria-label={t('hero.visual.tabsLabel', { defaultValue: 'How it works' })} className="relative mt-7 grid grid-cols-3 gap-2 px-2">
        {tabs.map((label, i) => {
          const active = step === i;
          return (
            <button
              key={label}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setStep(i)}
              className="group text-start focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E4DD8] rounded-sm"
            >
              <span className="relative block h-[3px] w-full overflow-hidden rounded-full bg-[#EADFD2]">
                {active && (
                  <span
                    key={`${step}-${paused}`}
                    className="hv-fill absolute inset-0 rounded-full bg-[#FF7A3D]"
                    style={{ animationPlayState: paused ? 'paused' : 'running' }}
                  />
                )}
              </span>
              <span className={`mt-2 block text-[12px] sm:text-[13px] font-heading font-semibold transition-colors ${active ? 'text-[#1B1F2A]' : 'text-[#6B7280] group-hover:text-[#1B1F2A]'}`}>
                {i + 1}. {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};