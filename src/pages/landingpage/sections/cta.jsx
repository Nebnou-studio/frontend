import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../components/Button';

export const Cta = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <section id="cta" className="py-16 md:py-24" aria-labelledby="cta-heading">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        
        {/* Full-width block with a large orange rounded container (radius 32px) */}
        <div className="relative rounded-[32px] bg-[#FF7A3D] p-8 sm:p-12 md:p-16 overflow-hidden">
          
          {/* Decorative: The three logo blocks large and partly cropped by container edge */}
          <div
            className={`absolute -bottom-10 ${
              isRtl ? '-left-10' : '-right-10'
            } pointer-events-none select-none opacity-25 hidden sm:block`}
            aria-hidden="true"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-48 rounded-3xl bg-[#1E4DD8]" />
              <div className="flex flex-col gap-4">
                <div className="w-36 h-16 rounded-3xl bg-[#FFF7EE]" />
                <div className="w-16 h-28 self-end rounded-3xl bg-[#1B1F2A]" />
              </div>
            </div>
          </div>

          <div className="relative z-10 max-w-2xl">
            {/* Small label */}
            <span
              style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
              className={`text-[12px] sm:text-[13px] tracking-[0.06em] text-[#1B1F2A]/80 mb-3 block ${
                isRtl ? '' : 'uppercase'
              }`}
            >
              {t('cta.eyebrow')}
            </span>

            {/* Big headline in Ink */}
            <h2
              id="cta-heading"
              style={{ lineHeight: isRtl ? '1.35' : '1.1' }}
              className="text-[32px] sm:text-[44px] lg:text-[54px] font-heading font-bold text-[#1B1F2A] tracking-tight mb-4"
            >
              {t('cta.headline')}
            </h2>

            {/* Supporting paragraph */}
            <p className="text-[17px] sm:text-[19px] text-[#1B1F2A]/85 leading-relaxed mb-8 max-w-[50ch]">
              {t('cta.paragraph')}
            </p>

            {/* Dark button (ink background, sand text) */}
            <Button to="/start" variant="dark" className="!h-[54px] !px-8 text-base">
              {t('cta.button')}
            </Button>
          </div>

        </div>

      </div>
    </section>
  );
};
