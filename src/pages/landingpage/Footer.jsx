import React from 'react';
import { useTranslation } from 'react-i18next';
import { Logo } from '../../components/Logo';
import { Button } from '../../components/Button';
import { Link } from 'react-router-dom';

const PinIcon = () => (
  <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
    <path d="M10 18s6-5.2 6-10a6 6 0 10-12 0c0 4.8 6 10 6 10z" />
    <circle cx="10" cy="8" r="2.2" />
  </svg>
);

export const Footer = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL;
  const contactPhone = import.meta.env.VITE_CONTACT_PHONE;

  const toggleLanguage = () => i18n.changeLanguage(i18n.language === 'fr' ? 'ar' : 'fr');

  const headingClass = 'mb-1 font-heading text-sm font-bold text-[#FFF7EE]';
  const linkClass =
    'rounded-md transition-colors focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#6C8CFF]';

  return (
    <footer className="mt-8 overflow-hidden rounded-t-[32px] bg-[#1B1F2A] text-[#FFF7EE]" role="contentinfo">
      <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6">
        {/* Closing statement + booking CTA */}
        <div className="relative py-16 md:py-24">
          {/* Brand blocks, same language as the Steps card */}
          <span aria-hidden="true" className="pointer-events-none absolute -end-10 top-8 hidden h-24 w-56 rounded-[24px] bg-[#FF7A3D]/15 md:block" />
          <span aria-hidden="true" className="pointer-events-none absolute end-24 bottom-6 hidden h-28 w-14 rounded-[16px] bg-[#1E4DD8]/25 md:block" />

          <p
            style={{ lineHeight: isRtl ? '1.4' : '1.12' }}
            className="relative max-w-3xl font-heading text-[30px] font-bold tracking-tight sm:text-[42px] lg:text-[52px]"
          >
            {t('footer.tagline')}
          </p>
          <div className="relative mt-8 flex flex-col items-start gap-2">
            <Button to="/start">{t('steps.cta')}</Button>
            <span className="text-xs text-[#FFF7EE]/70">{t('steps.ctaNote')}</span>
          </div>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-1 gap-10 border-t border-[#282D3C] py-12 md:grid-cols-12">
          <div className="flex flex-col items-start gap-5 md:col-span-5">
            <Logo reverse={true} />
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-heading text-xs text-[#FFF7EE]/90">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#22B893] motion-safe:animate-pulse" />
              <span>{t('footer.availability')}</span>
            </div>
          </div>

          <nav
            aria-label={t('footer.navTitle', { defaultValue: 'Navigation' })}
            className="flex flex-col items-start gap-3 font-heading text-sm md:col-span-4"
          >
            <span className={headingClass}>{t('footer.navTitle', { defaultValue: 'Navigation' })}</span>
            <a href="#projects" className={`${linkClass} text-[#FFF7EE]/80 hover:text-[#FF7A3D]`}>
              {t('footer.navProjects')}
            </a>
            <a href="#steps" className={`${linkClass} text-[#FFF7EE]/80 hover:text-[#FF7A3D]`}>
              {t('footer.navSteps')}
            </a>
            <Link to="/start" className={`${linkClass} font-semibold text-[#FF7A3D] hover:text-[#FF7A3D]/80`}>
              {t('footer.navBooking')} <span aria-hidden="true">{isRtl ? '↖' : '↗'}</span>
            </Link>
            <button
              type="button"
              onClick={toggleLanguage}
              className={`${linkClass} mt-1 text-xs text-[#FFF7EE]/70 hover:text-[#FFF7EE]`}
            >
              {i18n.language === 'fr' ? 'العربية' : 'Français'}
            </button>
          </nav>

          <div className="flex flex-col items-start gap-3 font-heading text-sm md:col-span-3">
            <span className={headingClass}>{t('footer.locationTitle', { defaultValue: 'Localisation' })}</span>
            <p className="flex items-center gap-2 text-[#FFF7EE]/80">
              <PinIcon />
              {t('footer.location')}
            </p>
            {contactEmail && (
              <a href={`mailto:${contactEmail}`} className={`${linkClass} text-xs text-[#FFF7EE]/75 hover:text-[#FF7A3D]`}>
                {contactEmail}
              </a>
            )}
            {contactPhone && (
              <a href={`tel:${contactPhone}`} dir="ltr" className={`${linkClass} text-xs text-[#FFF7EE]/75 hover:text-[#FF7A3D]`}>
                {contactPhone}
              </a>
            )}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[#282D3C] py-6 font-heading text-xs text-[#FFF7EE]/70">
          {t('footer.copyright')}
        </div>
      </div>
    </footer>
  );
};