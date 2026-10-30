import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../components/Button';


export const Hero = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <section
      id="hero"
      className="relative pt-[90px] md:pt-[120px] pb-16 md:pb-24 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 min-[1000px]:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column: Text (55% / 7 cols) */}
          <div className="min-[1000px]:col-span-7 flex flex-col items-start text-start">

            {/* 1. Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#EADFD2] mb-6 animate-fade-in-up stagger-1">
              <span className="w-2 h-2 rounded-full bg-[#FF7A3D]" aria-hidden="true" />
              <span
                style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
                className={`text-[12px] sm:text-[13px] tracking-[0.06em] text-[#1B1F2A] ${isRtl ? '' : 'uppercase'
                  }`}
              >
                {t('hero.eyebrow')}
              </span>
            </div>

            {/* 2. Headline */}
            <h1
              id="hero-heading"
              style={{
                lineHeight: isRtl ? '1.35' : '1.08',
              }}
              className="text-[38px] sm:text-[54px] lg:text-[70px] xl:text-[76px] font-heading font-bold text-[#1B1F2A] tracking-tight mb-6 animate-fade-in-up stagger-2"
            >
              <span>{t('hero.headlinePart1')} </span>
              <br className="hidden sm:inline" />
              <span>{t('hero.headlinePart2')} </span>
              <span className="relative inline-block whitespace-nowrap">
                <span className="relative z-10">{t('hero.headlineHighlight')}</span>
                {/* Thick rounded orange bar underline */}
                <span
                  className="absolute left-0 right-0 -bottom-1 sm:bottom-0.5 h-[8px] sm:h-[11px] bg-[#FF7A3D] rounded-full z-0 opacity-90"
                  aria-hidden="true"
                />
              </span>
            </h1>

            {/* 3. Supporting Paragraph */}
            <p className="max-w-[52ch] text-[17px] sm:text-[19px] leading-relaxed text-[#6B7280] mb-8 animate-fade-in-up stagger-3">
              {t('hero.paragraph')}
            </p>

            {/* 4. Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto animate-fade-in-up stagger-4">
              <Button to="/start" variant="primary" className="w-full sm:w-auto">
                {t('hero.primaryCta')}
              </Button>
              <Button href="#projects" variant="ghost" withArrow={false} className="w-full sm:w-auto">
                {t('hero.ghostCta')}
              </Button>
            </div>

            {/* 5. Trust Strip */}
            <div className="w-full pt-6 border-t border-[#EADFD2] flex flex-wrap items-center gap-y-3 gap-x-6 sm:gap-x-8 text-[#1B1F2A] text-xs sm:text-sm font-heading font-semibold animate-fade-in-up stagger-4">
              <div className="inline-flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-sm bg-[#1E4DD8]" aria-hidden="true" />
                <span>{t('hero.trust1')}</span>
              </div>
              <span className="hidden sm:inline text-[#EADFD2]">|</span>
              <div className="inline-flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-sm bg-[#FF7A3D]" aria-hidden="true" />
                <span>{t('hero.trust2')}</span>
              </div>
              <span className="hidden sm:inline text-[#EADFD2]">|</span>
              <div className="inline-flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-sm bg-[#1B1F2A]" aria-hidden="true" />
                <span>{t('hero.trust3')}</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Phone Mockup matching reference (45% / 5 cols) */}
          <div className="min-[1000px]:col-span-5 flex flex-col items-center justify-center">
            
          </div>

        </div>
      </div>
    </section>
  );
};
