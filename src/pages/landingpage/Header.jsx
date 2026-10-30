import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Logo } from '../../components/Logo';
import { Button } from '../../components/Button';

export const Header = () => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const closeButtonRef = useRef(null);
  const isRtl = i18n.language === 'ar';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle escape key and focus trapping for mobile menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      setTimeout(() => closeButtonRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'fr' ? 'ar' : 'fr';
    i18n.changeLanguage(nextLang);
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-[#FFF7EE] border-b border-[#EADFD2] shadow-xs'
          : 'bg-[#FFF7EE]/80 backdrop-blur-xs border-b border-transparent'
      }`}
      role="banner"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-[60px] md:h-[68px] flex items-center justify-between">
        {/* Start side: Logo */}
        <Logo />

        {/* Desktop Navigation (>= 900px) */}
        <nav className="hidden min-[900px]:flex items-center gap-8" aria-label="Navigation principale">
          <a
            href="#projects"
            className="text-[15px] font-heading font-medium text-[#1B1F2A] hover:text-[#FF7A3D] transition-colors"
          >
            {t('header.navProjects')}
          </a>
          <a
            href="#steps"
            className="text-[15px] font-heading font-medium text-[#1B1F2A] hover:text-[#FF7A3D] transition-colors"
          >
            {t('header.navSteps')}
          </a>

          {/* Language Switcher Pill */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#EADFD2] hover:border-[#1B1F2A] text-[13px] font-heading font-semibold text-[#1B1F2A] transition-all bg-[#FFFFFF]/60 hover:bg-[#FFFFFF]"
            aria-label="Changer de langue"
          >
            <span className={i18n.language === 'fr' ? 'text-[#FF7A3D] font-bold' : 'text-[#6B7280]'}>FR</span>
            <span className="text-[#6B7280]/40">/</span>
            <span className={i18n.language === 'ar' ? 'text-[#FF7A3D] font-bold' : 'text-[#6B7280]'}>AR</span>
          </button>

          {/* Primary CTA */}
          <Button to="/start" variant="primary" className="!h-[46px] !px-6 text-[15px]">
            {t('header.cta')}
          </Button>
        </nav>

        {/* Mobile Actions (< 900px) */}
        <div className="flex min-[900px]:hidden items-center gap-3">
          {/* Quick Language switch pill on mobile */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-2.5 py-1 rounded-full border border-[#EADFD2] text-[12px] font-heading font-bold text-[#1B1F2A] bg-[#FFFFFF]/70"
            aria-label="Changer de langue"
          >
            {isRtl ? 'FR' : 'العربية'}
          </button>

          {/* Hamburger / Menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="inline-flex items-center justify-center p-2 rounded-xl text-[#1B1F2A] hover:bg-[#1B1F2A]/5 focus-visible:outline-none"
            aria-label={t('header.menuOpen')}
            aria-expanded={mobileMenuOpen}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Fullscreen Sheet */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="fixed inset-0 z-50 bg-[#FFF7EE] flex flex-col justify-between p-6 sm:p-8 animate-fade-in-up"
          role="dialog"
          aria-modal="true"
          aria-label={t('header.menuOpen')}
        >
          <div className="flex items-center justify-between">
            <Logo />
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeMenu}
              className="p-3 rounded-full border border-[#EADFD2] text-[#1B1F2A] hover:bg-[#1B1F2A]/5"
              aria-label={t('header.menuClose')}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col gap-6 py-8" aria-label="Navigation mobile">
            <a
              href="#projects"
              onClick={closeMenu}
              className="text-3xl font-heading font-bold text-[#1B1F2A] hover:text-[#FF7A3D] transition-colors"
            >
              {t('header.navProjects')}
            </a>
            <a
              href="#steps"
              onClick={closeMenu}
              className="text-3xl font-heading font-bold text-[#1B1F2A] hover:text-[#FF7A3D] transition-colors"
            >
              {t('header.navSteps')}
            </a>
            <div className="pt-4 border-t border-[#EADFD2] flex items-center justify-between">
              <span className="text-[#6B7280] font-heading text-sm">Langue / اللغة:</span>
              <button
                type="button"
                onClick={toggleLanguage}
                className="px-4 py-2 rounded-full border border-[#1B1F2A] text-sm font-heading font-semibold text-[#1B1F2A] bg-white"
              >
                {t('header.switchLang')}
              </button>
            </div>
          </nav>

          <div className="pb-4">
            <Button
              to="/start"
              variant="primary"
              className="w-full justify-center !text-base"
              onClick={closeMenu}
            >
              {t('header.cta')}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
