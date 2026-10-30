import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { projects } from '../../../data/projects';
import { Button } from '../../../components/Button';
import { BrandMark } from '../../../components/BrandBlocks';

export const Projects = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [activeCategory, setActiveCategory] = useState('all');

  // Calculate counts
  const totalCount = projects.length;
  const ecommerceCount = projects.filter((p) => p.category === 'ecommerce').length;
  const platformsCount = projects.filter((p) => p.category === 'platforms').length;
  const showcaseCount = projects.filter((p) => p.category === 'showcase').length;

  const categories = [
    { key: 'all', label: t('projects.filterAll', { count: totalCount }) },
    { key: 'ecommerce', label: t('projects.filterEcommerce', { count: ecommerceCount }) },
    { key: 'platforms', label: t('projects.filterPlatforms', { count: platformsCount }) },
    { key: 'showcase', label: t('projects.filterShowcase', { count: showcaseCount }) },
  ];

  // Filtered projects
  const filteredProjects = useMemo(() => {
    if (activeCategory === 'all') return projects;
    return projects.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  // Check if at least 3 real projects exist to render the trust row
  const realProjectsCount = projects.filter((p) => !p.isExample).length;
  const showTrustRow = realProjectsCount >= 3;

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'ecommerce':
        return isRtl ? 'تجارة إلكترونية' : 'E-commerce';
      case 'platforms':
        return isRtl ? 'منصة' : 'Plateforme';
      case 'showcase':
        return isRtl ? 'موقع تعريفي' : 'Site vitrine';
      default:
        return category;
    }
  };

  return (
    <section
      id="projects"
      className="py-16 md:py-24 border-t border-[#EADFD2]"
      aria-labelledby="projects-heading"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col items-start mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 mb-3">
            <span
              style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
              className={`text-[12px] sm:text-[13px] tracking-[0.06em] text-[#6B7280] ${
                isRtl ? '' : 'uppercase'
              }`}
            >
              {t('projects.eyebrow', { count: String(totalCount).padStart(2, '0') })}
            </span>
          </div>

          <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2
                id="projects-heading"
                style={{ lineHeight: isRtl ? '1.35' : '1.12' }}
                className="text-[30px] sm:text-[42px] lg:text-[52px] font-heading font-bold text-[#1B1F2A] tracking-tight mb-3"
              >
                {t('projects.headline')}
              </h2>
              <p className="text-[17px] sm:text-[19px] text-[#6B7280] max-w-[65ch]">
                {t('projects.subtitle')}
              </p>
            </div>

            <a
              href="#gallery"
              className="inline-flex items-center gap-1.5 text-sm font-heading font-semibold text-[#1B1F2A] hover:text-[#FF7A3D] transition-colors self-start md:self-end whitespace-nowrap"
            >
              {t('projects.explore')}
            </a>
          </div>
        </div>

        {/* Filter Tabs */}
        <div id="gallery" className="mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-heading font-semibold transition-all whitespace-nowrap border ${
                  activeCategory === cat.key
                    ? 'bg-[#1B1F2A] text-[#FFF7EE] border-[#1B1F2A]'
                    : 'bg-white text-[#1B1F2A] border-[#EADFD2] hover:border-[#1B1F2A]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Displayed count line */}
          <p className="text-xs sm:text-sm text-[#6B7280] mt-3 font-heading font-medium">
            {filteredProjects.length === 1
              ? t('projects.displayedCountSingle')
              : t('projects.displayedCount', { count: filteredProjects.length })}
          </p>
        </div>

        {/* Project Cards Grid (3 cols desktop, 2 tablet, 1 mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {filteredProjects.map((project) => {
            const hasLiveUrl = Boolean(project.liveUrl);

            return (
              <div
                key={project.id}
                className="group relative flex flex-col bg-white rounded-[24px] border border-[#EADFD2] hover:border-[#1B1F2A] transition-all duration-300 p-4 overflow-hidden"
              >
                {/* 1. Cover Image (4:3 aspect ratio, radius 24px) */}
                <div className="relative aspect-[4/3] w-full rounded-[20px] overflow-hidden bg-[#FFF7EE] border border-[#EADFD2] mb-4">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={t(project.titleKey)}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    /* Brand-crafted aesthetic placeholder panel */
                    <div className="w-full h-full flex flex-col justify-between p-5 bg-[#FFF7EE] transition-transform duration-500 group-hover:scale-[1.03]">
                      <div className="flex items-center justify-between">
                        <div className="p-1.5 bg-white rounded-lg border border-[#EADFD2]">
                          <BrandMark size={24} />
                        </div>
                        {project.isExample && (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-heading font-bold bg-[#1B1F2A]/10 text-[#1B1F2A]">
                            {t('projects.exampleBadge')}
                          </span>
                        )}
                      </div>

                      {/* Geometric Brand Blocks motif illustration */}
                      <div className="flex items-end justify-center gap-2.5 py-4 select-none opacity-85">
                        <div className="w-7 h-20 rounded-xl bg-[#1E4DD8]" />
                        <div className="flex flex-col gap-2">
                          <div className="w-16 h-7 rounded-xl bg-[#FF7A3D]" />
                          <div className="w-7 h-11 self-end rounded-xl bg-[#1B1F2A]" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono text-[#6B7280]">
                        <span>nebnou.studio</span>
                        <span>{project.year}</span>
                      </div>
                    </div>
                  )}

                  {/* 2. Top-left chip on image: Category */}
                  <div className="absolute top-3 start-3">
                    <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[11px] font-heading font-semibold text-[#1B1F2A] shadow-xs border border-[#EADFD2]">
                      {getCategoryLabel(project.category)}
                    </span>
                  </div>

                  {/* 3. Top-right chip on image (only if live URL) */}
                  {hasLiveUrl && (
                    <div className="absolute top-3 end-3">
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#1B1F2A] text-white text-[11px] font-heading font-semibold hover:bg-[#FF7A3D] hover:text-[#1B1F2A] transition-colors shadow-xs"
                      >
                        <span>{t('projects.liveSite')}</span>
                        <span>{isRtl ? '↖' : '↗'}</span>
                      </a>
                    </div>
                  )}
                </div>

                {/* 4. Meta row: Index ("01"), Type, Year */}
                <div className="flex items-center justify-between text-xs font-heading font-semibold text-[#6B7280] mb-2 px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[#1E4DD8] font-mono">{project.id}</span>
                    <span>·</span>
                    <span>{getCategoryLabel(project.category)}</span>
                  </div>
                  <span className="font-mono">{project.year}</span>
                </div>

                {/* 5. Title */}
                <h3
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '20px' }}
                  className="text-[#1B1F2A] leading-snug mb-2 px-1"
                >
                  {t(project.titleKey)}
                </h3>

                {/* 6. One-sentence description */}
                <p className="text-[14px] text-[#6B7280] leading-relaxed line-clamp-2 mb-4 px-1 flex-1">
                  {t(project.descKey)}
                </p>

                {/* 7. Link "Voir le projet →" */}
                {hasLiveUrl && (
                  <div className="pt-2 border-t border-[#EADFD2] px-1">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-[#1B1F2A] group-hover:text-[#FF7A3D] transition-colors"
                    >
                      <span>{t('projects.viewProject')}</span>
                      <span className="transition-transform group-hover:translate-x-1 duration-200">
                        {isRtl ? '←' : '→'}
                      </span>
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* End of Section: Centered Call to Action */}
        <div className="text-center py-8 px-4 rounded-[24px] bg-[#FFFFFF] border border-[#EADFD2]">
          <p
            style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}
            className="text-[20px] sm:text-[26px] text-[#1B1F2A] mb-4"
          >
            {t('projects.endQuestion')}
          </p>
          <Button to="/start" variant="primary">
            {t('projects.endCta')}
          </Button>
        </div>

        {/* Conditional Trust Row (only shown if at least 3 projects have isExample: false) */}
        {showTrustRow && (
          <div className="mt-16 pt-8 border-t border-[#EADFD2] overflow-hidden">
            <p className="text-center text-xs font-heading font-semibold text-[#6B7280] uppercase tracking-wider mb-6">
              {t('projects.trustClients')}
            </p>
            <div className="flex items-center gap-12 text-[#1B1F2A] font-heading font-semibold text-lg animate-pulse whitespace-nowrap">
              <span>Client A</span>
              <span>Client B</span>
              <span>Client C</span>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
