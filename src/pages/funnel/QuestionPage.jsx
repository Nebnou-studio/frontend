import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFunnel } from '../../context/FunnelContext';
import {
  Arrow,
  Check,
  FieldError,
  BORDER,
  MUTED,
  SURFACE,
  TEXT,
  FOCUS,
  ghostBtn,
  inputClass,
  primaryBtn,
} from './funnelUi';

const TOTAL = 3;
const ACTIVITIES = ['commerce', 'restaurant', 'services', 'education', 'health', 'realestate', 'industry', 'other'];
const BLOCK_COLORS = ['bg-[#1E4DD8]', 'bg-[#FF7A3D]', 'bg-[#1B1F2A] dark:bg-[#FFF7EE]'];
const SUGGESTIONS = ['s1', 's2', 's3', 's4'];
const MAX_PROBLEM = 500;

// Shared look of a selectable card (a native radio input sits inside, for keyboard and screen readers)
const cardClass = `flex items-center gap-3 rounded-2xl border-2 p-4 transition-colors ${BORDER} ${SURFACE} hover:border-[color:var(--muted)] peer-checked:border-[color:var(--text)] peer-checked:[&_svg]:opacity-100 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-[#1E4DD8]`;

export default function QuestionPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { answers, updateAnswers } = useFunnel();
  const isRtl = (i18n.language || '').startsWith('ar');

  const [step, setStep] = useState(0);
  const [errorKey, setErrorKey] = useState('');
  const headingRef = useRef(null);

  // Move focus to the new question so screen readers announce it
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  const change = (patch) => {
    updateAnswers(patch);
    setErrorKey('');
  };

  const validate = () => {
    if (step === 0) {
      if (!answers.activity) return 'funnel.q1.required';
      if (answers.activity === 'other' && answers.activity_other.trim().length < 2) return 'funnel.q1.otherRequired';
    }
    if (step === 1 && answers.problem.trim().length < 10) return 'funnel.q2.tooShort';
    if (step === 2 && typeof answers.tried_before !== 'boolean') return 'funnel.q3.required';
    return '';
  };

  const goNext = (e) => {
    e.preventDefault();
    const problem = validate();
    if (problem) {
      setErrorKey(problem);
      return;
    }
    if (step < TOTAL - 1) setStep(step + 1);
    else navigate('/start/booking');
  };

  const goBack = () => {
    setErrorKey('');
    if (step === 0) navigate('/start');
    else setStep(step - 1);
  };

  const addSuggestion = (text) => {
    const current = answers.problem.trim().replace(/[.\s]+$/, '');
    change({ problem: (current ? `${current}. ${text}` : text).slice(0, MAX_PROBLEM) });
  };

  const titleKey = `funnel.q${step + 1}.title`;

  return (
    <form onSubmit={goNext} noValidate className="mx-auto max-w-[680px]" aria-labelledby="q-title">
      {/* Question counter and mini progress */}
      <div className="mb-8 flex items-center gap-4">
        <p className={`font-heading text-sm font-semibold ${MUTED}`}>
          {t('funnel.q.counter', { n: step + 1, total: TOTAL })}
        </p>
        <div className="flex flex-1 gap-1.5" aria-hidden="true">
          {Array.from({ length: TOTAL }, (_, i) => (
            <span
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= step ? 'bg-[#1E4DD8] dark:bg-[#7C9BFF]' : 'bg-[var(--border)]'
              }`}
            />
          ))}
        </div>
      </div>

      <div key={step} className="fn-in">
        <h1
          id="q-title"
          ref={headingRef}
          tabIndex={-1}
          style={{ lineHeight: isRtl ? '1.4' : '1.15' }}
          className={`font-heading text-[28px] font-bold tracking-tight outline-none sm:text-[38px] ${TEXT}`}
        >
          {t(titleKey)}
        </h1>
        <p className={`mt-3 text-base leading-relaxed sm:text-lg ${MUTED}`}>{t(`funnel.q${step + 1}.hint`)}</p>

        {/* Question 1: activity */}
        {step === 0 && (
          <div className="mt-8">
            <div
              role="radiogroup"
              aria-labelledby="q-title"
              aria-describedby={errorKey ? 'q-error' : undefined}
              className="grid gap-3 sm:grid-cols-2"
            >
              {ACTIVITIES.map((key, i) => (
                <label key={key} className="relative block cursor-pointer">
                  <input
                    type="radio"
                    name="activity"
                    value={key}
                    checked={answers.activity === key}
                    onChange={() => change({ activity: key })}
                    className="peer sr-only"
                  />
                  <span className={cardClass}>
                    <span className={`h-4 w-4 shrink-0 rounded-[5px] ${BLOCK_COLORS[i % 3]}`} aria-hidden="true" />
                    <span className={`font-heading text-[15px] font-semibold ${TEXT}`}>
                      {t(`funnel.q1.options.${key}`)}
                    </span>
                    <Check className="ms-auto shrink-0 opacity-0 transition-opacity" />
                  </span>
                </label>
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
                  autoFocus
                  maxLength={80}
                  value={answers.activity_other}
                  onChange={(e) => change({ activity_other: e.target.value })}
                  placeholder={t('funnel.q1.otherPlaceholder')}
                  className={inputClass(false)}
                />
              </div>
            )}
          </div>
        )}

        {/* Question 2: the problem */}
        {step === 1 && (
          <div className="mt-8">
            <textarea
              id="q-problem"
              rows={5}
              maxLength={MAX_PROBLEM}
              autoFocus
              value={answers.problem}
              onChange={(e) => change({ problem: e.target.value })}
              placeholder={t('funnel.q2.placeholder')}
              aria-labelledby="q-title"
              aria-describedby={errorKey ? 'q-error' : undefined}
              className={`${inputClass(Boolean(errorKey))} resize-y leading-relaxed`}
            />
            <p className={`mt-2 text-end text-xs ${MUTED}`} dir="ltr" aria-hidden="true">
              {answers.problem.length}/{MAX_PROBLEM}
            </p>

            <p className={`mt-4 text-sm font-semibold ${TEXT}`}>{t('funnel.q2.suggestionsLabel')}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {SUGGESTIONS.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => addSuggestion(t(`funnel.q2.suggestions.${key}`))}
                  className={`rounded-full border px-3.5 py-2 text-sm font-medium transition-colors hover:border-[color:var(--text)] ${BORDER} ${SURFACE} ${TEXT} ${FOCUS}`}
                >
                  {t(`funnel.q2.suggestions.${key}`)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Question 3: tried another solution? */}
        {step === 2 && (
          <div className="mt-8">
            <div
              role="radiogroup"
              aria-labelledby="q-title"
              aria-describedby={errorKey ? 'q-error' : undefined}
              className="grid gap-3 sm:grid-cols-2"
            >
              {[
                [true, 'yes', 'bg-[#1E4DD8]'],
                [false, 'no', 'bg-[#FF7A3D]'],
              ].map(([value, key, color]) => (
                <label key={key} className="relative block cursor-pointer">
                  <input
                    type="radio"
                    name="tried"
                    value={key}
                    checked={answers.tried_before === value}
                    onChange={() => change({ tried_before: value })}
                    className="peer sr-only"
                  />
                  <span className={`${cardClass} py-6`}>
                    <span className={`h-4 w-4 shrink-0 rounded-[5px] ${color}`} aria-hidden="true" />
                    <span className={`font-heading text-lg font-semibold ${TEXT}`}>{t(`funnel.q3.${key}`)}</span>
                    <Check className="ms-auto shrink-0 opacity-0 transition-opacity" />
                  </span>
                </label>
              ))}
            </div>

            {answers.tried_before === true && (
              <div className="fn-in mt-4">
                <label htmlFor="q-details" className={`mb-2 block text-sm font-semibold ${TEXT}`}>
                  {t('funnel.q3.detailsLabel')}
                </label>
                <input
                  id="q-details"
                  type="text"
                  autoFocus
                  maxLength={160}
                  value={answers.tried_details}
                  onChange={(e) => change({ tried_details: e.target.value })}
                  placeholder={t('funnel.q3.detailsPlaceholder')}
                  className={inputClass(false)}
                />
              </div>
            )}
          </div>
        )}

        <FieldError id="q-error">{errorKey && t(errorKey)}</FieldError>
      </div>

      {/* Navigation */}
      <div className="mt-10 flex items-center justify-between gap-4">
        <button type="button" onClick={goBack} className={ghostBtn}>
          <Arrow glyph="←" />
          {t('funnel.q.back')}
        </button>
        <button type="submit" className={primaryBtn}>
          {step < TOTAL - 1 ? t('funnel.q.next') : t('funnel.q.finish')}
          <Arrow />
        </button>
      </div>
    </form>
  );
}