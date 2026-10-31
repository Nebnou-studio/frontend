import React from 'react';
import { useTranslation } from 'react-i18next';
import { BrandMark, BrandMarkReverse } from './BrandBlocks';

export const Logo = ({ reverse = false, className = '' }) => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  return (
    <a
      href="http://localhost:5173/"
      className={`inline-flex items-center gap-2.5 group transition-transform duration-200 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4DD8] rounded-lg ${className}`}
      aria-label="Nebnou Studio Home"
    >
      {reverse ? (
        <BrandMarkReverse size={30} />
      ) : (
        <BrandMark size={30} />
      )}
      <span
        style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '22px' }}
        className={`tracking-tight lowercase leading-none ${
          reverse ? 'text-[#FFF7EE]' : 'text-[#1B1F2A]'
        }`}
      >
        nebnou
      </span>
      {isArabic && (
        <span
          style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '18px' }}
          className={`leading-none ${reverse ? 'text-[#FFF7EE]/80' : 'text-[#6B7280]'}`}
        >
          نبنيو
        </span>
      )}
    </a>
  );
};
