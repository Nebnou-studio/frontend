import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { projects } from '../../../data/projects';
import { Button } from '../../../components/Button';
import { BrandMark } from '../../../components/BrandBlocks';

const GAP = 24; // px, matches gap-6

/* ---------- Mockup Visuals for Projects ---------- */
const PreviewBrowserChrome = ({ domain, isLive, liveText }) => (
  <div className="flex items-center justify-between px-3.5 py-2.5 bg-white border-b border-[#EADFD2] text-xs select-none">
    {/* Window dots */}
    <div className="flex items-center gap-1.5" aria-hidden="true">
      <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]/80" />
      <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]/80" />
      <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]/80" />
    </div>

    {/* URL bar */}
    <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FFF7EE] border border-[#EADFD2] text-[11px] font-mono text-[#6B7280] max-w-[200px] truncate" dir="ltr">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[#22B893] shrink-0">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
      <span className="truncate">{domain}</span>
    </div>

    {/* Status pill */}
    {isLive ? (
      <span className="inline-flex items-center gap-1.5 text-[10px] font-heading font-bold text-[#137A5B] bg-[#E8F8F3] px-2 py-0.5 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-[#22B893] animate-pulse" />
        <span className="hidden sm:inline">{liveText}</span>
      </span>
    ) : (
      <span className="text-[10px] font-mono text-[#6B7280] font-semibold">.dz</span>
    )}
  </div>
);

const EcommerceMockup = ({ isRtl, slug }) => (
  <div className="h-full w-full flex flex-col justify-between p-3.5 bg-gradient-to-b from-[#FFF7EE] to-[#F7EDE0] text-[#1B1F2A] select-none">
    {/* Brand header with Nebnou-built badge */}
    <div className="flex items-center justify-between pb-2 border-b border-[#EADFD2]/70">
      <div className="flex items-center gap-2">
        {/* Client logo placeholder — square using brand orange */}
        <div className="w-5 h-5 rounded bg-[#FF7A3D] flex items-center justify-center text-[9px] text-white font-bold">
          {slug === 'safir-mode' ? 'SM' : 'DZ'}
        </div>
        <span className="text-[11px] font-heading font-bold text-[#1B1F2A]">
          {slug === 'safir-mode' ? 'Safir Mode' : 'Dar Zellige'}
        </span>
      </div>
      <span className="text-[10px] font-heading font-semibold px-2 py-0.5 rounded-full bg-[#FF7A3D]/15 text-[#E2591B]">
        {isRtl ? 'توصيل 58 ولاية' : 'Livraison 58 wilayas'}
      </span>
    </div>

    {/* Products grid — clean color blocks */}
    <div className="grid grid-cols-2 gap-2 my-auto">
      <div className="p-2 rounded-xl bg-white border border-[#EADFD2]">
        <div className="w-full h-10 rounded-lg bg-[#FF7A3D]/10 mb-1.5" />
        <div className="h-2 w-12 bg-[#1B1F2A]/20 rounded mb-1" />
        <div className="h-2.5 w-16 bg-[#1E4DD8]/40 rounded" />
      </div>
      <div className="p-2 rounded-xl bg-white border border-[#EADFD2]">
        <div className="w-full h-10 rounded-lg bg-[#1E4DD8]/10 mb-1.5" />
        <div className="h-2 w-14 bg-[#1B1F2A]/20 rounded mb-1" />
        <div className="h-2.5 w-14 bg-[#1E4DD8]/40 rounded" />
      </div>
    </div>

    {/* COD strip + Nebnou built-by watermark */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-white border border-[#EADFD2]">
        <span className="w-2 h-2 rounded-full bg-[#22B893]" />
        <span className="text-[10px] font-heading font-bold text-[#1B1F2A]">
          {isRtl ? 'الدفع عند الاستلام' : 'COD – Paiement livraison'}
        </span>
      </div>
      {/* Nebnou brand mark as the "built by" badge */}
      <div className="flex items-center gap-1 opacity-60">
        <BrandMark size={14} />
      </div>
    </div>
  </div>
);

const ShowcaseMockup = ({ isRtl, slug }) => (
  <div className="h-full w-full flex flex-col justify-between p-3.5 bg-gradient-to-b from-[#F2F6FE] to-[#E5EDFD] text-[#1B1F2A] select-none">
    {/* Client brand header */}
    <div className="flex items-center justify-between pb-2 border-b border-[#CBD7F5]">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded bg-[#1E4DD8] flex items-center justify-center text-[9px] text-white font-bold">
          {slug === 'clinique-el-bahdja' ? 'EB' : 'BA'}
        </div>
        <span className="text-[11px] font-heading font-bold text-[#1B1F2A]">
          {slug === 'clinique-el-bahdja' ? 'El-Bahdja Santé' : 'Benali & Associés'}
        </span>
      </div>
      <div className="flex items-center gap-1 text-[10px] font-bold text-[#1E4DD8] bg-white px-2 py-0.5 rounded-full border border-[#CBD7F5]">
        <span>FR</span>
        <span className="text-[#CBD7F5]">|</span>
        <span>عربي</span>
      </div>
    </div>

    {/* Hero content block */}
    <div className="p-2.5 rounded-xl bg-white border border-[#CBD7F5] my-auto">
      <div className="flex items-center justify-between mb-2">
        <div className="space-y-1">
          <div className="h-2.5 w-28 bg-[#1B1F2A] rounded" />
          <div className="h-2 w-36 bg-[#6B7280]/40 rounded" />
        </div>
        <div className="w-8 h-8 rounded-lg bg-[#1E4DD8]/10" />
      </div>
      <div className="flex items-center gap-1.5 pt-1 border-t border-[#EADFD2]/50 text-[10px] font-heading font-semibold text-[#1E4DD8]">
        <span>{isRtl ? 'حجز موعد مسبق' : 'Prise de rendez-vous'}</span>
        <span className="ms-auto text-[9px] text-[#22B893] font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#22B893] inline-block" />Ouvert</span>
      </div>
    </div>

    {/* Footer: location + Nebnou brand mark */}
    <div className="flex items-center justify-between text-[10px] font-heading text-[#6B7280]">
      <span>{isRtl ? 'الجزائر العاصمة' : 'Alger Centre'}</span>
      <div className="flex items-center gap-1 opacity-60">
        <BrandMark size={14} />
      </div>
    </div>
  </div>
);

const PlatformMockup = ({ isRtl, slug }) => (
  <div className="h-full w-full flex flex-col justify-between p-3.5 bg-gradient-to-b from-[#F5F6F8] to-[#E8EAEF] text-[#1B1F2A] select-none">
    {/* Platform header with Nebnou brand mark */}
    <div className="flex items-center justify-between pb-2 border-b border-[#D5D9E2]">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded bg-[#1B1F2A] flex items-center justify-center text-[9px] text-white font-bold">
          {slug === 'dz-fleet-logistics' ? 'DZ' : 'AN'}
        </div>
        <span className="text-[11px] font-heading font-bold text-[#1B1F2A]">
          {slug === 'dz-fleet-logistics' ? 'DZ Fleet Portal' : 'Académie Numérique'}
        </span>
      </div>
      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1B1F2A] text-white">
        v2.4
      </span>
    </div>

    {/* Stats grid */}
    <div className="grid grid-cols-2 gap-2 my-auto">
      <div className="p-2 rounded-xl bg-white border border-[#D5D9E2]">
        <div className="text-[9px] text-[#6B7280] font-heading">
          {slug === 'dz-fleet-logistics' ? (isRtl ? 'طرود اليوم' : 'Colis / jour') : (isRtl ? 'المشتركون' : 'Étudiants')}
        </div>
        <div className="text-xs font-mono font-bold text-[#1B1F2A] mt-0.5">
          {slug === 'dz-fleet-logistics' ? '1,280 DZ' : '850+'}
        </div>
        <div className="h-1.5 w-full bg-[#EADFD2] rounded-full mt-1.5 overflow-hidden">
          <div className="h-full w-3/4 bg-[#22B893] rounded-full" />
        </div>
      </div>
      <div className="p-2 rounded-xl bg-white border border-[#D5D9E2]">
        <div className="text-[9px] text-[#6B7280] font-heading">
          {slug === 'dz-fleet-logistics' ? (isRtl ? 'نسبة التسليم' : 'Taux livraison') : (isRtl ? 'الدورات' : 'Modules')}
        </div>
        <div className="text-xs font-mono font-bold text-[#1E4DD8] mt-0.5">
          {slug === 'dz-fleet-logistics' ? '96.4%' : '24 cours'}
        </div>
        <div className="h-1.5 w-full bg-[#EADFD2] rounded-full mt-1.5 overflow-hidden">
          <div className="h-full w-4/5 bg-[#1E4DD8] rounded-full" />
        </div>
      </div>
    </div>

    {/* Status bar + Nebnou brand mark */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5 text-[10px] font-heading text-[#1B1F2A]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#22B893]" />
        {isRtl ? 'النظام يعمل بشكل طبيعي' : 'Système opérationnel'}
      </div>
      <div className="flex items-center gap-1 opacity-60">
        <BrandMark size={14} />
      </div>
    </div>
  </div>
);

export const Projects = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [activeCategory, setActiveCategory] = useState('all');

  // Carousel state
  const trackRef = useRef(null);
  const [current, setCurrent] = useState(0);
  const [thumb, setThumb] = useState({ width: 100, offset: 0 });
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  // Counts
  const totalCount = projects.length;
  const ecommerceCount = projects.filter((p) => p.category === 'ecommerce').length;
  const platformsCount = projects.filter((p) => p.category === 'platforms').length;
  const showcaseCount = projects.filter((p) => p.category === 'showcase').length;

  const categories = [
    { key: 'all', label: t('projects.filterAll', { count: totalCount }), count: totalCount },
    { key: 'ecommerce', label: t('projects.filterEcommerce', { count: ecommerceCount }), count: ecommerceCount },
    { key: 'platforms', label: t('projects.filterPlatforms', { count: platformsCount }), count: platformsCount },
    { key: 'showcase', label: t('projects.filterShowcase', { count: showcaseCount }), count: showcaseCount },
  ];

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'all') return projects;
    return projects.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  const realProjectsCount = projects.filter((p) => !p.isExample).length;
  const showTrustRow = realProjectsCount >= 3;

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'ecommerce':
        return isRtl ? 'تجارة إلكترونية' : 'E-commerce & COD';
      case 'platforms':
        return isRtl ? 'منصة مخصصة' : 'Plateforme web';
      case 'showcase':
        return isRtl ? 'موقع تعريفي' : 'Site vitrine';
      default:
        return category;
    }
  };

  /* ---------- Carousel helpers ---------- */
  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const pos = Math.abs(el.scrollLeft); // negative in RTL
    const card = el.firstElementChild;
    const step = card ? card.getBoundingClientRect().width + GAP : 1;

    const widthPct = Math.min(100, (el.clientWidth / el.scrollWidth) * 100);
    const ratio = max > 0 ? pos / max : 0;

    setCurrent(Math.min(filteredProjects.length - 1, Math.round(pos / step)));
    setThumb({ width: widthPct, offset: ratio * (100 - widthPct) });
    setAtStart(pos < 4);
    setAtEnd(max <= 4 || pos >= max - 4);
  }, [filteredProjects.length]);

  // Reset to first card when filter changes
  useEffect(() => {
    const el = trackRef.current;
    if (el) el.scrollLeft = 0;
    updateScrollState();
  }, [activeCategory, updateScrollState]);

  useEffect(() => {
    window.addEventListener('resize', updateScrollState);
    return () => window.removeEventListener('resize', updateScrollState);
  }, [updateScrollState]);

  const scrollByCard = (dir) => {
    const el = trackRef.current;
    if (!el || !el.firstElementChild) return;
    const step = el.firstElementChild.getBoundingClientRect().width + GAP;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({
      left: dir * (isRtl ? -1 : 1) * step,
      behavior: reduce ? 'auto' : 'smooth',
    });
  };

  const arrowFlip = isRtl ? 'scale-x-[-1]' : '';
  const pad = (n) => String(n).padStart(2, '0');

  return (
    <section
      id="projects"
      className="py-16 md:py-24 border-t border-[#EADFD2] bg-[#FAF8F5]/60"
      aria-labelledby="projects-heading"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col items-start mb-10 md:mb-14">
          {/* Distinctive Nebnou Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFF7EE] border border-[#EADFD2] text-xs font-heading font-semibold text-[#1B1F2A] mb-4">
            <span className="w-2 h-2 rounded-full bg-[#FF7A3D]" aria-hidden="true" />
            <span>{t('projects.eyebrow')}</span>
          </div>

          <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-[760px]">
              <h2
                id="projects-heading"
                style={{ lineHeight: isRtl ? '1.3' : '1.15' }}
                className="text-[30px] sm:text-[42px] lg:text-[48px] font-heading font-bold text-[#1B1F2A] tracking-tight mb-4"
              >
                {t('projects.headline')}
              </h2>
              <p className="text-[16px] sm:text-[18px] text-[#6B7280] leading-relaxed">
                {t('projects.subtitle')}
              </p>
            </div>

            <a
              href="#gallery"
              className="inline-flex items-center gap-2 text-sm font-heading font-semibold text-[#1B1F2A] hover:text-[#FF7A3D] transition-colors self-start md:self-end whitespace-nowrap pb-1"
            >
              <span>{t('projects.explore')}</span>
            </a>
          </div>
        </div>

        {/* Filter Segmented Controls */}
        <div id="gallery" className="mb-8">
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            {categories.map((cat) => {
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setActiveCategory(cat.key)}
                  aria-pressed={isActive}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-heading font-semibold transition-all whitespace-nowrap border ${
                    isActive
                      ? 'bg-[#1B1F2A] text-white border-[#1B1F2A] shadow-sm'
                      : 'bg-white text-[#6B7280] border-[#EADFD2] hover:border-[#1B1F2A] hover:text-[#1B1F2A]'
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          <p className="text-xs sm:text-sm text-[#6B7280] mt-3 font-heading font-medium">
            {filteredProjects.length === 1
              ? t('projects.displayedCountSingle')
              : t('projects.displayedCount', { count: filteredProjects.length })}
          </p>
        </div>

        {/* ---------- Cards Carousel ---------- */}
        <div
          ref={trackRef}
          onScroll={updateScrollState}
          role="region"
          aria-label={t('projects.headline')}
          tabIndex={0}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 pt-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E4DD8] rounded-[32px]"
          style={{ scrollbarWidth: 'none' }}
        >
          {filteredProjects.map((project) => {
            const hasLiveUrl = Boolean(project.liveUrl);
            const rawTags = t(project.tagsKey, { returnObjects: true });
            const tags = Array.isArray(rawTags) ? rawTags : [];

            return (
              <article
                key={project.id}
                className="group snap-start shrink-0 w-[88%] sm:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)] flex flex-col rounded-[28px] bg-white border border-[#EADFD2] shadow-sm hover:shadow-xl hover:border-[#FF7A3D]/70 transition-all duration-300 overflow-hidden"
              >
                {/* Browser Device Preview Frame */}
                <div className="relative w-full overflow-hidden border-b border-[#EADFD2] bg-[#FFF7EE]">
                  <PreviewBrowserChrome
                    domain={project.domain || `${project.slug}.dz`}
                    isLive={hasLiveUrl}
                    liveText={t('projects.liveSite')}
                  />

                  {/* Visual Preview Area */}
                  <div className="aspect-[16/10] w-full overflow-hidden">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={t(project.titleKey)}
                        loading="lazy"
                        className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : project.category === 'ecommerce' ? (
                      <EcommerceMockup isRtl={isRtl} slug={project.slug} />
                    ) : project.category === 'showcase' ? (
                      <ShowcaseMockup isRtl={isRtl} slug={project.slug} />
                    ) : (
                      <PlatformMockup isRtl={isRtl} slug={project.slug} />
                    )}
                  </div>
                </div>


                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col">
                  {/* Meta row: number — category · year */}
                  <div className="flex items-center gap-2 text-xs font-heading font-semibold text-[#6B7280] mb-3">
                    <span className="font-mono text-[#1E4DD8]">{project.id}</span>
                    <span className="h-px w-4 bg-[#EADFD2]" aria-hidden="true" />
                    <span>{getCategoryLabel(project.category)}</span>
                    <span className="ms-auto font-mono">{project.year}</span>
                  </div>

                  {/* Title */}
                  <h3
                    style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}
                    className="text-[21px] sm:text-[23px] leading-snug text-[#1B1F2A] mb-2"
                  >
                    {t(project.titleKey)}
                  </h3>

                  {/* Short description */}
                  <p className="text-[14px] leading-relaxed text-[#6B7280] mb-6 line-clamp-2 flex-1">
                    {t(project.descKey)}
                  </p>

                  {/* CTA */}
                  {hasLiveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="self-start inline-flex items-center gap-3 rounded-full bg-[#1B1F2A] ps-5 pe-1.5 py-1.5 text-sm font-heading font-semibold text-white hover:bg-[#FF7A3D] hover:text-[#1B1F2A] transition-colors group/btn"
                    >
                      <span>{t('projects.viewProject')}</span>
                      <span
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF7A3D] text-[#1B1F2A] group-hover/btn:bg-[#1B1F2A] group-hover/btn:text-white transition-colors"
                        aria-hidden="true"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={arrowFlip}>
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </span>
                    </a>
                  ) : (
                    <span className="self-start inline-flex items-center gap-2 text-sm font-heading font-semibold text-[#6B7280]">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-[#6B7280]">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      {t('projects.viewInternal')}
                    </span>
                  )}
                </div>

              </article>
            );
          })}
        </div>

        {/* ---------- Carousel Controls ---------- */}
        <div className="mt-6 flex items-center justify-between gap-5 bg-white p-3.5 sm:p-4 rounded-2xl border border-[#EADFD2]">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#FF7A3D]" aria-hidden="true" />
            <p className="font-heading font-semibold text-xs sm:text-sm text-[#1B1F2A]" dir="ltr" aria-live="polite">
              <span>{pad(current + 1)}</span> / {pad(filteredProjects.length)}
            </p>
          </div>

          <div className="relative h-[4px] flex-1 max-w-[400px] overflow-hidden rounded-full bg-[#EADFD2]" aria-hidden="true">
            <span
              className="absolute inset-y-0 rounded-full bg-[#FF7A3D] transition-[inset-inline-start,width] duration-200"
              style={{ width: `${thumb.width}%`, insetInlineStart: `${thumb.offset}%` }}
            />
          </div>

          <div className="flex items-center gap-2">
            {[-1, 1].map((dir) => {
              const disabled = dir === -1 ? atStart : atEnd;
              return (
                <button
                  key={dir}
                  type="button"
                  onClick={() => scrollByCard(dir)}
                  disabled={disabled}
                  aria-label={dir === -1 ? (isRtl ? 'السابق' : 'Précédent') : (isRtl ? 'التالي' : 'Suivant')}
                  className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-[#1B1F2A] text-white transition-all hover:bg-[#FF7A3D] hover:text-[#1B1F2A] disabled:bg-[#EADFD2] disabled:text-[#9AA0AB] disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E4DD8]"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={(dir === -1 ? 'scale-x-[-1]' : '') + (isRtl ? ' scale-x-[-1]' : '')}
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
              );
            })}
          </div>
        </div>

        {/* ---------- End of Section: Nebnou Studio Callout Banner ---------- */}
        <div className="mt-14 sm:mt-16 rounded-[28px] bg-[#FFF7EE] border border-[#EADFD2] p-6 sm:p-10 md:p-12 shadow-sm text-center">
          <div className="max-w-[720px] mx-auto">
            <span className="inline-block text-xs font-heading font-bold text-[#E2591B] uppercase tracking-wider mb-3">
              ✦ {t('projects.endEyebrow')}
            </span>

            <h3
              style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}
              className="text-[22px] sm:text-[30px] md:text-[34px] text-[#1B1F2A] leading-tight mb-4"
            >
              {t('projects.endQuestion')}
            </h3>

            <p className="text-[15px] sm:text-[17px] text-[#6B7280] leading-relaxed mb-6 max-w-[62ch] mx-auto">
              {t('projects.endSubtitle')}
            </p>

            {/* Reassurance pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-8 text-xs font-heading font-semibold text-[#1B1F2A]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#EADFD2]">
                <span className="text-[#22B893]">✓</span> {t('projects.badgeNoCommitment')}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#EADFD2]">
                <span className="text-[#22B893]">✓</span> {t('projects.badgeFreeDesign')}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#EADFD2]">
                <span className="text-[#22B893]">✓</span> {t('projects.badgeFastReply')}
              </span>
            </div>

            <Button to="/start" variant="primary" className="text-base px-8 py-3.5 shadow-md">
              {t('projects.endCta')}
            </Button>
          </div>
        </div>

        {/* Conditional Trust Row */}
        {showTrustRow && (
          <div className="mt-16 pt-8 border-t border-[#EADFD2] overflow-hidden">
            <p className="text-center text-xs font-heading font-semibold text-[#6B7280] uppercase tracking-wider mb-6">
              {t('projects.trustClients')}
            </p>
            <div className="flex items-center justify-center gap-12 text-[#1B1F2A] font-heading font-semibold text-lg opacity-60">
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