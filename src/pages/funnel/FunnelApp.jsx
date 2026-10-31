import React, { useEffect, useState } from 'react';
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Logo } from '../../components/Logo';
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

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 8);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div className={`min-h-screen bg-[var(--bg)] ${TEXT}`}>
            <style>{FUNNEL_CSS}</style>

            <a
                href="#funnel-main"
                className="sr-only rounded-md bg-[var(--surface)] px-4 py-2 font-heading text-sm font-semibold focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50"
            >
                {t('funnel.skip')}
            </a>

            <header className="pointer-events-none fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-6 sm:pt-4" role="banner">
                <div
                    className={`pointer-events-auto mx-auto flex max-w-[1100px] items-center justify-between rounded-full border ps-5 pe-2 backdrop-blur-md transition-[height,box-shadow,background-color] duration-300 motion-reduce:transition-none ${BORDER} ${isScrolled
                            ? 'h-[52px] bg-[color-mix(in_srgb,var(--bg,#FFF7EE)_92%,transparent)] shadow-[0_8px_24px_-12px_rgba(27,31,42,0.35)] md:h-[56px]'
                            : 'h-[56px] bg-[color-mix(in_srgb,var(--bg,#FFF7EE)_70%,transparent)] md:h-[64px]'
                        }`}
                >
                    <Logo />

                    <div className="flex items-center gap-1 sm:gap-2">
                        {/* Desktop: FR / AR, active language in orange */}
                        <button
                            type="button"
                            onClick={toggleLang}
                            aria-label={t('header.switchLang')}
                            className={`hidden items-center gap-1.5 rounded-full px-3 py-2 font-heading text-[13px] font-semibold transition-colors hover:bg-[color:var(--text)]/5 sm:inline-flex ${FOCUS}`}
                        >
                            <span dir="ltr" className={!isRtl ? 'font-bold text-[#FF7A3D]' : MUTED}>FR</span>
                            <span aria-hidden="true" className={`${MUTED} opacity-40`}>/</span>
                            <span dir="ltr" className={isRtl ? 'font-bold text-[#FF7A3D]' : MUTED}>AR</span>
                        </button>

                        {/* Mobile: name of the other language */}
                        <button
                            type="button"
                            onClick={toggleLang}
                            aria-label={t('header.switchLang')}
                            className={`inline-flex h-10 items-center rounded-full bg-[#1B1F2A] px-4 font-heading text-[12px] font-bold text-[#FFF7EE] dark:bg-[#FFF7EE] dark:text-[#1B1F2A] sm:hidden ${FOCUS}`}
                        >
                            {isRtl ? 'FR' : 'العربية'}
                        </button>
                    </div>
                </div>
            </header>

            {/* The header is fixed, so this keeps the content below it */}
            <div aria-hidden="true" className="h-[72px] sm:h-[84px]" />

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