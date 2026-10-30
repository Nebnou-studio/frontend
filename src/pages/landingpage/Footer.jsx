import React from 'react';
import { useTranslation } from 'react-i18next';
import { Logo } from '../../components/Logo';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL;
  const contactPhone = import.meta.env.VITE_CONTACT_PHONE;

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'fr' ? 'ar' : 'fr';
    i18n.changeLanguage(nextLang);
  };

  return (
    <footer className="bg-[#1B1F2A] text-[#FFF7EE] pt-16 pb-12 border-t border-[#282D3C]" role="contentinfo">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        
        {/* Top Row: 3 Columns on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#282D3C]">
          
          {/* Column 1: Brand & Tagline (5 cols) */}
          <div className="md:col-span-5 flex flex-col items-start gap-4">
            <Logo reverse={true} />
            <p className="text-sm text-[#FFF7EE]/70 font-heading">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Column 2: Navigation (4 cols) */}
          <div className="md:col-span-4 flex flex-col items-start gap-3 text-sm font-heading">
            <span className="text-xs uppercase tracking-wider text-[#6B7280] font-bold mb-1">
              Navigation
            </span>
            <a href="#projects" className="text-[#FFF7EE]/80 hover:text-[#FF7A3D] transition-colors">
              {t('footer.navProjects')}
            </a>
            <a href="#steps" className="text-[#FFF7EE]/80 hover:text-[#FF7A3D] transition-colors">
              {t('footer.navSteps')}
            </a>
            <Link to="/start" className="text-[#FF7A3D] hover:text-[#FF7A3D]/80 transition-colors font-semibold">
              {t('footer.navBooking')} {isRtl ? '↖' : '↗'}
            </Link>
            <button
              type="button"
              onClick={toggleLanguage}
              className="text-[#FFF7EE]/60 hover:text-[#FFF7EE] transition-colors text-xs mt-1"
            >
              {i18n.language === 'fr' ? 'العربية' : 'Français'}
            </button>
          </div>

          {/* Column 3: Contact & Location (3 cols) */}
          <div className="md:col-span-3 flex flex-col items-start gap-3 text-sm font-heading">
            <span className="text-xs uppercase tracking-wider text-[#6B7280] font-bold mb-1">
              Localisation
            </span>
            <p className="text-[#FFF7EE]/80 flex items-center gap-2">
              <span className="text-base">📍</span> {t('footer.location')}
            </p>

            {/* Optional contact details if provided in env */}
            {contactEmail && (
              <a href={`mailto:${contactEmail}`} className="text-[#FFF7EE]/70 hover:text-[#FF7A3D] text-xs">
                {contactEmail}
              </a>
            )}
            {contactPhone && (
              <a href={`tel:${contactPhone}`} className="text-[#FFF7EE]/70 hover:text-[#FF7A3D] text-xs">
                {contactPhone}
              </a>
            )}
          </div>

        </div>

        {/* Bottom Row: Copyright + Availability Status */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FFF7EE]/60 font-heading">
          <div>{t('footer.copyright')}</div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#FFF7EE]/90">
            <span className="w-2 h-2 rounded-full bg-[#22B893] animate-pulse" />
            <span>{t('footer.availability')}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
