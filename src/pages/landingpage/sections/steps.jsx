import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../components/Button';
import { VISUALS, StepVisualStyles, Check } from './StepVisuals';

const TOTAL = 5;
// Payment badge per step: free, free, 20 %, none, 80 %
const BADGES = ['free', 'free', 'deposit', null, 'balance'];

// Theme-aware tokens (defined in index.css, they flip in dark mode)
const TEXT = 'text-[color:var(--text)]';
const MUTED = 'text-[color:var(--muted)]';
const BORDER = 'border-[color:var(--border)]';
const SURFACE = 'bg-[var(--surface)]';

/* ---------- Main section ---------- */

export const Steps = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [activeStep, setActiveStep] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const itemRefs = useRef([]);

  const steps = Array.from({ length: TOTAL }, (_, i) => ({
    number: String(i + 1).padStart(2, '0'),
    title: t(`steps.items.${i}.title`),
    desc: t(`steps.items.${i}.desc`),
    badge: BADGES[i],
  }));

  // One observer: the active step is the one crossing the middle of the viewport
  useEffect(() => {
    const els = itemRefs.current.filter(Boolean);
    if (!els.length) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveStep(Number(entry.target.dataset.index));
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (activeStep > 0) setHasScrolled(true);
  }, [activeStep]);

  const goTo = (index) => {
    const el = itemRefs.current[index];
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
  };

  const renderBadge = (key) =>
    key ? (
      <span
        className={`mb-3 inline-flex items-center rounded-full px-3 py-1 text-xs font-heading font-bold ${
          key === 'free'
            ? 'bg-[#22B893]/15 text-[#13795e] dark:text-[#22B893]'
            : 'bg-[#FF7A3D]/20 text-[#B8470F] dark:text-[#FF7A3D]'
        }`}
      >
        {t(`steps.badges.${key}`)}
      </span>
    ) : null;

  const eyebrowClass = `text-[12px] sm:text-[13px] tracking-[0.06em] ${MUTED} ${isRtl ? '' : 'uppercase'}`;
  const ActiveVisual = VISUALS[activeStep];

  return (
    <section
      id="steps"
      className={`border-t py-16 md:py-24 ${BORDER}`}
      aria-labelledby="steps-heading"
    >
      <StepVisualStyles />

      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        {/* Header + risk-free promise */}
        <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <span
              style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
              className={`mb-3 block ${eyebrowClass}`}
            >
              {t('steps.eyebrow')}
            </span>
            <h2
              id="steps-heading"
              style={{ lineHeight: isRtl ? '1.35' : '1.12' }}
              className={`font-heading text-[30px] font-bold tracking-tight sm:text-[42px] lg:text-[52px] ${TEXT}`}
            >
              {t('steps.headline')}
            </h2>
          </div>
          <p
            className={`inline-flex items-center gap-2 self-start rounded-full border px-4 py-2.5 font-heading text-sm font-semibold md:self-auto ${BORDER} ${SURFACE} ${TEXT}`}
          >
            <Check className="text-[#22B893]" />
            {t('steps.guarantee')}
          </p>
        </div>

        {/* Desktop (1024px and up): scroll-driven rail + sticky visual card */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-12">
          <ol className="col-span-5">
            {steps.map((step, i) => {
              const active = i === activeStep;
              const done = i < activeStep;
              const showCta = active && (i === 0 || i === TOTAL - 1);
              return (
                <li
                  key={step.number}
                  ref={(el) => (itemRefs.current[i] = el)}
                  data-index={i}
                  aria-current={active ? 'step' : undefined}
                  className="relative flex min-h-[42vh] items-center ps-14"
                >
                  {i < TOTAL - 1 && (
                    <span
                      aria-hidden="true"
                      className="absolute start-4 top-1/2 h-full w-px overflow-hidden bg-[var(--border)]"
                    >
                      {/* orange fill grows down the line instead of snapping */}
                      <span
                        className="block h-full w-full origin-top bg-[#FF7A3D] transition-transform duration-700 ease-out motion-reduce:transition-none"
                        style={{ transform: done ? 'scaleY(1)' : 'scaleY(0)' }}
                      />
                    </span>
                  )}

                  <span
                    aria-hidden="true"
                    className={`absolute start-0 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full font-heading text-sm font-bold transition-all duration-500 motion-reduce:transition-none ${
                      active || done
                        ? 'bg-[#FF7A3D] text-[#1B1F2A]'
                        : `border ${BORDER} ${SURFACE} ${MUTED}`
                    } ${active ? 'ring-4 ring-[#FF7A3D]/25' : ''}`}
                  >
                    {step.number}
                  </span>

                  <div
                    className={`transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none ${
                      active ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-60'
                    }`}
                  >
                    {renderBadge(step.badge)}
                    <h3 className={`font-heading text-2xl font-bold leading-snug ${TEXT}`}>
                      <button
                        type="button"
                        onClick={() => goTo(i)}
                        className="rounded-md text-start focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#1E4DD8]"
                      >
                        {step.title}
                      </button>
                    </h3>
                    <p className={`mt-2 max-w-md text-base leading-relaxed ${MUTED}`}>{step.desc}</p>

                    {showCta && (
                      <div className="mt-6 flex flex-col items-start gap-2">
                        <Button to="/start">{t('steps.cta')}</Button>
                        <span className={`text-xs ${MUTED}`}>{t('steps.ctaNote')}</span>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="col-span-7">
            <div className="sticky top-24 flex h-[540px] flex-col overflow-hidden rounded-[32px] bg-[#1B1F2A] text-white">
              {/* Decorative brand blocks */}
              <span aria-hidden="true" className="pointer-events-none absolute -end-6 -top-6 h-20 w-44 rounded-[20px] bg-[#FF7A3D]/15" />
              <span aria-hidden="true" className="pointer-events-none absolute -bottom-10 start-6 h-40 w-20 rounded-[20px] bg-[#1E4DD8]/20" />

              <div className="relative flex items-center justify-between border-b border-white/10 p-6 text-xs font-heading font-semibold text-white/70">
                <span className="font-mono text-sm text-white" dir="ltr">
                  {String(activeStep + 1).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
                </span>
                <span aria-live="polite" className="truncate px-4">
                  {steps[activeStep].title}
                </span>
                {!hasScrolled && (
                  <span className="shrink-0 text-[#FF7A3D] motion-safe:animate-pulse">
                    {t('steps.scrollHint')} ↓
                  </span>
                )}
              </div>

              <div className="relative flex-1">
                <div key={activeStep} className="h-full">
                  <ActiveVisual />
                </div>
              </div>

              <div className="relative flex items-center justify-center gap-2 bg-white/5 p-4">
                {steps.map((step, i) => (
                  <button
                    key={step.number}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={t('steps.goToStep', { n: i + 1 })}
                    className={`h-1.5 rounded-full transition-all ${
                      activeStep === i ? 'w-8 bg-[#FF7A3D]' : 'w-2 bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile and tablet (below 1024px): stacked cards + CTA */}
        <ol className="flex flex-col gap-5 lg:hidden">
          {steps.map((step, i) => {
            const Visual = VISUALS[i];
            return (
              <li
                key={step.number}
                className={`overflow-hidden rounded-[24px] border ${BORDER} ${SURFACE}`}
              >
                <div className="bg-[#1B1F2A]">
                  <Visual />
                </div>
                <div className="p-6">
                  {renderBadge(step.badge)}
                  <div className="mb-2 flex items-center gap-3">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF7A3D] font-heading text-sm font-bold text-[#1B1F2A]">
                      {step.number}
                    </span>
                    <h3 className={`font-heading text-lg font-bold ${TEXT}`}>{step.title}</h3>
                  </div>
                  <p className={`ps-11 text-sm leading-relaxed ${MUTED}`}>{step.desc}</p>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-8 flex flex-col items-center gap-2 lg:hidden">
          <Button to="/start">{t('steps.cta')}</Button>
          <span className={`text-xs ${MUTED}`}>{t('steps.ctaNote')}</span>
        </div>

        {/* Commitment block */}
        <div
          className={`mt-16 grid gap-8 rounded-[32px] border p-8 sm:p-10 lg:mt-20 lg:grid-cols-12 lg:items-center ${BORDER} ${SURFACE}`}
        >
          <div className="lg:col-span-5">
            <span
              style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
              className={`mb-2 block ${eyebrowClass}`}
            >
              {t('commitment.eyebrow')}
            </span>
            <h3
              style={{ lineHeight: isRtl ? '1.35' : '1.15' }}
              className={`font-heading text-2xl font-bold sm:text-3xl ${TEXT}`}
            >
              {t('commitment.headline')}
            </h3>
          </div>

          <ul className={`flex flex-col gap-3 font-heading text-sm font-semibold lg:col-span-4 ${TEXT}`}>
            {[
              ['bg-[#1E4DD8]', 'commitment.item1'],
              ['bg-[#FF7A3D]', 'commitment.item2'],
              ['bg-[#1B1F2A] dark:bg-[#FFF7EE]', 'commitment.item3'],
            ].map(([color, key]) => (
              <li key={key} className="flex items-center gap-3">
                <span aria-hidden="true" className={`h-3 w-3 rounded-[4px] ${color}`} />
                {t(key)}
              </li>
            ))}
          </ul>

          <div className="flex flex-col items-start gap-2 lg:col-span-3 lg:items-end">
            <Button to="/start">{t('steps.cta')}</Button>
            <span className={`text-xs ${MUTED}`}>{t('steps.ctaNote')}</span>
          </div>
        </div>
      </div>
    </section>
  );
};