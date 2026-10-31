import React, { useEffect } from 'react';
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BrandMark } from '../../components/BrandBlocks';
import { FunnelProvider, isAnswersComplete, useFunnel } from '../../context/FunnelContext';
import VideoPage from './VideoPage';
import QuestionPage from './QuestionPage';
import BookingPage from './BookingPage';
import { Arrow, Check, BORDER, FOCUS, FUNNEL_CSS, MUTED, SURFACE, TEXT, primaryBtn } from './funnelUi';

const STEP_BY_PATH = { '/start': 1, '/start/questions': 2, '/start/booking': 3 };
const STEP_KEYS = ['video', 'questions', 'booking'];

/* ---------- Layout: logo, language switch, 3-step progress ---------- */

function FunnelLayout({ children }) {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const isRtl = (i18n.language || '').startsWith('ar');
  const current = STEP_BY_PATH[pathname.replace(/\/+$/, '') || '/'] || 0; // 0 = no progress bar (confirmation)

  // The funnel can be opened directly from an ad: set language and direction here too
  useEffect(() => {
    const root = document.documentElement;
    root.lang = isRtl ? 'ar' : 'fr';
    root.dir = isRtl ? 'rtl' : 'ltr';
  }, [isRtl]);

  useEffect(() => {
    document.title = t('funnel.pageTitle');
  }, [t, i18n.language]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const toggleLang = () => {
    const next = isRtl ? 'fr' : 'ar';
    i18n.changeLanguage(next);
    try {
      localStorage.setItem('nebnou-lang', next);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className={`min-h-screen bg-[var(--bg)] ${TEXT}`}>
      <style>{FUNNEL_CSS}</style>

      <a
        href="#funnel-main"
        className="sr-only rounded-md bg-[var(--surface)] px-4 py-2 font-heading text-sm font-semibold focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50"
      >
        {t('funnel.skip')}
      </a>

      <header className={`sticky top-0 z-30 border-b bg-[var(--bg)] ${BORDER}`}>
        <div className="mx-auto flex h-16 max-w-[1100px] items-center justify-between px-4 sm:px-6">
          <Link to="/" aria-label="Nebnou" className={`flex items-center gap-2.5 rounded-md ${FOCUS}`}>
            <BrandMark size={30} />
            <span className="font-heading text-[22px] font-bold">nebnou</span>
          </Link>
          <button
            type="button"
            onClick={toggleLang}
            className={`rounded-full border px-4 py-2 font-heading text-sm font-semibold transition-colors hover:border-[color:var(--text)] ${BORDER} ${FOCUS}`}
          >
            {t('header.switchLang')}
          </button>
        </div>
      </header>

      {current > 0 && (
        <nav aria-label={t('funnel.stepOf', { current, total: STEP_KEYS.length })} className="mx-auto max-w-[720px] px-4 pt-6 sm:px-6">
          <ol className="grid grid-cols-3 gap-2">
            {STEP_KEYS.map((key, i) => {
              const reached = i + 1 <= current;
              return (
                <li key={key} aria-current={i + 1 === current ? 'step' : undefined}>
                  <span className={`block h-1.5 rounded-full transition-colors ${reached ? 'bg-[#FF7A3D]' : 'bg-[var(--border)]'}`} />
                  <span className={`mt-2 block font-heading text-xs font-semibold sm:text-[13px] ${i + 1 === current ? TEXT : MUTED}`}>
                    {i + 1}. {t(`funnel.steps.${key}`)}
                  </span>
                </li>
              );
            })}
          </ol>
        </nav>
      )}

      <main id="funnel-main" className="mx-auto w-full max-w-[1100px] px-4 pb-20 pt-8 sm:px-6 sm:pt-10">
        {children}
      </main>
    </div>
  );
}

/* ---------- Confirmation page ---------- */

function DonePage() {
  const { t, i18n } = useTranslation();
  const { booking, reset } = useFunnel();
  const isRtl = (i18n.language || '').startsWith('ar');
  const loc = isRtl ? 'ar-DZ-u-nu-latn' : 'fr-FR';

  const when = new Intl.DateTimeFormat(loc, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Africa/Algiers',
  }).format(new Date(booking.start_at));

  return (
    <section aria-labelledby="done-title" className="fn-in mx-auto max-w-[620px] text-center">
      <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#22B893]/15 text-[#22B893]">
        <Check className="h-8 w-8" />
      </span>

      <h1
        id="done-title"
        style={{ lineHeight: isRtl ? '1.4' : '1.12' }}
        className={`font-heading text-[32px] font-bold tracking-tight sm:text-[44px] ${TEXT}`}
      >
        {t('funnel.done.title')}
      </h1>
      <p className={`mt-3 text-lg ${MUTED}`}>{t('funnel.done.greeting', { name: booking.name })}</p>

      <div className={`mt-8 rounded-[24px] border p-6 ${BORDER} ${SURFACE}`}>
        <p className={`text-sm font-semibold ${MUTED}`}>{t('funnel.done.text')}</p>
        <p className={`mt-2 font-heading text-xl font-bold capitalize sm:text-2xl ${TEXT}`}>{when}</p>
        <p className={`mt-1 text-sm ${MUTED}`}>{t('funnel.booking.tzShort')}</p>
      </div>

      <p className={`mx-auto mt-6 max-w-[48ch] text-base leading-relaxed ${MUTED}`}>{t('funnel.done.linkNote')}</p>

      <Link to="/" onClick={reset} className={`${primaryBtn} mt-8`}>
        {t('funnel.done.home')}
        <Arrow />
      </Link>
    </section>
  );
}

/* ---------- Routes with guards: no skipping steps ---------- */

const Guard = ({ ok, to, children }) => (ok ? children : <Navigate to={to} replace />);

function FunnelRoutes() {
  const { videoWatched, answers, booking } = useFunnel();
  return (
    <Routes>
      <Route index element={<VideoPage />} />
      <Route
        path="questions"
        element={
          <Guard ok={videoWatched} to="/start">
            <QuestionPage />
          </Guard>
        }
      />
      <Route
        path="booking"
        element={
          <Guard ok={videoWatched && isAnswersComplete(answers)} to={videoWatched ? '/start/questions' : '/start'}>
            <BookingPage />
          </Guard>
        }
      />
      <Route
        path="done"
        element={
          <Guard ok={Boolean(booking)} to="/start">
            <DonePage />
          </Guard>
        }
      />
      <Route path="*" element={<Navigate to="/start" replace />} />
    </Routes>
  );
}

export default function FunnelApp() {
  return (
    <FunnelProvider>
      <FunnelLayout>
        <FunnelRoutes />
      </FunnelLayout>
    </FunnelProvider>
  );
}