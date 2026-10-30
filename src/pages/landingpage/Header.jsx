import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Logo } from '../../components/Logo';
import { Button } from '../../components/Button';

const SECTIONS = [
  { id: 'projects', key: 'header.navProjects' },
  { id: 'steps', key: 'header.navSteps' },
];

// Theme-aware tokens (fallbacks keep the light look if a variable is missing)
const TEXT = 'text-[color:var(--text,#1B1F2A)]';
const MUTED = 'text-[color:var(--muted,#6B7280)]';
const BORDER = 'border-[color:var(--border,#EADFD2)]';
const BG = 'bg-[var(--bg,#FFF7EE)]';
const FOCUS = 'focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#1E4DD8]';

export const Header = () => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const mobileMenuRef = useRef(null);
  const closeButtonRef = useRef(null);
  const openButtonRef = useRef(null);
  const isRtl = i18n.language === 'ar';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Active section = the one crossing the middle of the viewport
  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean);
    if (!els.length) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Escape closes, Tab stays inside the sheet, focus returns to the opener
  useEffect(() => {
    if (!mobileMenuOpen) {
      document.body.style.overflow = '';
      return undefined;
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        return;
      }
      if (e.key !== 'Tab' || !mobileMenuRef.current) return;
      const focusable = mobileMenuRef.current.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const mq = window.matchMedia('(min-width: 900px)');
    const handleResize = (e) => e.matches && setMobileMenuOpen(false);

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    mq.addEventListener('change', handleResize);
    const focusTimer = setTimeout(() => closeButtonRef.current?.focus(), 50);
    const opener = openButtonRef.current;

    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
      mq.removeEventListener('change', handleResize);
      opener?.focus();
    };
  }, [mobileMenuOpen]);

  const toggleLanguage = () => i18n.changeLanguage(i18n.language === 'fr' ? 'ar' : 'fr');
  const closeMenu = () => setMobileMenuOpen(false);

  const langLabel = t('header.changeLanguage', { defaultValue: 'Changer de langue' });
  const navLabel = t('header.navLabel', { defaultValue: 'Navigation principale' });
  const mobileNavLabel = t('header.navLabelMobile', { defaultValue: 'Navigation mobile' });

  return (
    <>
      {/* Floating bar: the wrapper ignores pointer events so only the pill is clickable */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-6 sm:pt-4" role="banner">
        <div
          className={`pointer-events-auto mx-auto flex max-w-[1200px] items-center justify-between rounded-full border ps-5 pe-2 backdrop-blur-md transition-[height,box-shadow,background-color] duration-300 motion-reduce:transition-none ${BORDER} ${
            isScrolled
              ? 'h-[52px] bg-[color-mix(in_srgb,var(--bg,#FFF7EE)_92%,transparent)] shadow-[0_8px_24px_-12px_rgba(27,31,42,0.35)] md:h-[56px]'
              : 'h-[56px] bg-[color-mix(in_srgb,var(--bg,#FFF7EE)_70%,transparent)] md:h-[64px]'
          }`}
        >
          <Logo />

          {/* Desktop (>= 900px) */}
          <nav className="hidden items-center gap-1 min-[900px]:flex" aria-label={navLabel}>
            {SECTIONS.map((s) => {
              const active = activeSection === s.id;
              return (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  aria-current={active ? 'true' : undefined}
                  className={`rounded-full px-4 py-2 text-[15px] font-heading font-medium transition-colors motion-reduce:transition-none ${FOCUS} ${
                    active
                      ? 'bg-[#FF7A3D]/15 text-[#B8470F] dark:text-[#FF7A3D]'
                      : `${TEXT} hover:bg-[color:var(--text,#1B1F2A)]/5`
                  }`}
                >
                  {t(s.key)}
                </a>
              );
            })}

            <button
              type="button"
              onClick={toggleLanguage}
              className={`mx-2 inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[13px] font-heading font-semibold transition-colors hover:bg-[color:var(--text,#1B1F2A)]/5 ${FOCUS} ${TEXT}`}
              aria-label={langLabel}
            >
              <span dir="ltr" className={i18n.language === 'fr' ? 'font-bold text-[#FF7A3D]' : MUTED}>FR</span>
              <span aria-hidden="true" className={`${MUTED} opacity-40`}>/</span>
              <span dir="ltr" className={i18n.language === 'ar' ? 'font-bold text-[#FF7A3D]' : MUTED}>AR</span>
            </button>

            <Button to="/start" variant="primary" className="!h-[44px] !px-6 text-[15px]">
              {t('header.cta')}
            </Button>
          </nav>

          {/* Mobile (< 900px) */}
          <div className="flex items-center gap-1 min-[900px]:hidden">
            <button
              type="button"
              onClick={toggleLanguage}
              className={`rounded-full px-3 py-2 text-[12px] font-heading font-bold ${FOCUS} ${TEXT}`}
              aria-label={langLabel}
            >
              {isRtl ? 'FR' : 'العربية'}
            </button>

            <button
              ref={openButtonRef}
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#1B1F2A] text-[#FFF7EE] dark:bg-[#FFF7EE] dark:text-[#1B1F2A] ${FOCUS}`}
              aria-label={t('header.menuOpen')}
              aria-expanded={mobileMenuOpen}
              aria-haspopup="dialog"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
                <line x1="4" y1="8" x2="20" y2="8" />
                <line x1="4" y1="16" x2="20" y2="16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile sheet, outside <header> so the blur cannot shrink it */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className={`fixed inset-0 z-50 flex flex-col justify-between overflow-hidden overflow-y-auto p-6 sm:p-8 motion-safe:animate-fade-in-up ${BG}`}
          role="dialog"
          aria-modal="true"
          aria-label={t('header.menuOpen')}
        >
          {/* Brand blocks, same language as the Steps card */}
          <span aria-hidden="true" className="pointer-events-none absolute -end-8 top-24 h-24 w-48 rounded-[24px] bg-[#FF7A3D]/15" />
          <span aria-hidden="true" className="pointer-events-none absolute -start-6 bottom-40 h-40 w-20 rounded-[20px] bg-[#1E4DD8]/15" />

          <div className="relative flex items-center justify-between">
            <Logo />
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeMenu}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full border ${BORDER} ${TEXT} ${FOCUS}`}
              aria-label={t('header.menuClose')}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <nav className="relative flex flex-col gap-2 py-8" aria-label={mobileNavLabel}>
            {SECTIONS.map((s, i) => {
              const active = activeSection === s.id;
              return (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={closeMenu}
                  aria-current={active ? 'true' : undefined}
                  className={`flex items-center gap-4 rounded-2xl py-3 font-heading text-3xl font-bold transition-colors ${FOCUS} ${
                    active ? 'text-[#FF7A3D]' : TEXT
                  }`}
                >
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF7A3D] font-heading text-sm font-bold text-[#1B1F2A]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {t(s.key)}
                </a>
              );
            })}
            <div className={`mt-4 flex items-center justify-between border-t pt-5 ${BORDER}`}>
              <span className={`font-heading text-sm ${MUTED}`}>Langue / اللغة :</span>
              <button
                type="button"
                onClick={toggleLanguage}
                className={`rounded-full border px-4 py-2 font-heading text-sm font-semibold bg-[var(--surface,#FFFFFF)] border-[color:var(--text,#1B1F2A)] ${TEXT} ${FOCUS}`}
              >
                {t('header.switchLang')}
              </button>
            </div>
          </nav>

          <div className="relative pb-4">
            <Button to="/start" variant="primary" className="w-full justify-center !text-base" onClick={closeMenu}>
              {t('header.cta')}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};