import React from 'react';

// Theme-aware tokens (defined in index.css, they flip in dark mode)
export const TEXT = 'text-[color:var(--text)]';
export const MUTED = 'text-[color:var(--muted)]';
export const BORDER = 'border-[color:var(--border)]';
export const SURFACE = 'bg-[var(--surface)]';
export const ERROR = 'text-[#B3261E] dark:text-[#FF8A80]';
export const FOCUS =
  'focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#1E4DD8]';

export const primaryBtn = `inline-flex items-center justify-center gap-3 rounded-full bg-[#FF7A3D] px-7 py-4 font-heading text-base font-semibold text-[#1B1F2A] transition-transform duration-200 hover:-translate-y-0.5 hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 motion-reduce:transition-none motion-reduce:hover:transform-none ${FOCUS}`;

export const ghostBtn = `inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 font-heading text-sm font-semibold transition-colors ${MUTED} hover:text-[color:var(--text)] ${FOCUS}`;

export const inputClass = (hasError) =>
  `w-full rounded-xl border bg-[var(--surface)] px-4 py-3.5 text-base ${TEXT} placeholder:text-[color:var(--muted)] focus:outline-none focus:ring-2 ${
    hasError
      ? 'border-[#B3261E] focus:ring-[#B3261E]/25'
      : `${BORDER} focus:border-[#1E4DD8] focus:ring-[#1E4DD8]/25`
  }`;

// Animations only when the visitor accepts motion
export const FUNNEL_CSS = `
  @media (prefers-reduced-motion: no-preference) {
    .fn-in { animation: fn-in .45s ease-out both; }
    @keyframes fn-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
  }
`;

// Mirrors automatically in right-to-left
export const Arrow = ({ glyph = '→' }) => (
  <span aria-hidden="true" className="inline-block rtl:-scale-x-100">
    {glyph}
  </span>
);

export const Check = ({ className = '' }) => (
  <svg
    viewBox="0 0 20 20"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M4 10.5l4 4 8-9" />
  </svg>
);

export const FieldError = ({ id, children }) =>
  children ? (
    <p id={id} role="alert" className={`mt-2 text-sm font-medium ${ERROR}`}>
      {children}
    </p>
  ) : null;

