import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../components/Button';
import { projects } from '../../../data/projects';

// Theme-aware tokens (defined in index.css, they flip in dark mode)
const TEXT = 'text-[color:var(--text)]';
const MUTED = 'text-[color:var(--muted)]';
const BORDER = 'border-[color:var(--border)]';
const SURFACE = 'bg-[var(--surface)]';
const ACCENT = 'text-[#1E4DD8] dark:text-[#7C9BFF]';

const CATEGORY_ORDER = ['ecommerce', 'platforms', 'showcase'];
const GAP_PX = 16;
const pad = (n) => String(n).padStart(2, '0');
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Small icons ---------- */

const GridIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <rect x="2" y="2" width="5" height="5" rx="1" />
    <rect x="9" y="2" width="5" height="5" rx="1" />
    <rect x="2" y="9" width="5" height="5" rx="1" />
    <rect x="9" y="9" width="5" height="5" rx="1" />
  </svg>
);

const ListIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
    <path d="M2 4h12M2 8h12M2 12h12" />
  </svg>
);

// Mirrors automatically in right-to-left
const Arrow = ({ glyph = '→' }) => (
  <span aria-hidden="true" className="inline-block rtl:-scale-x-100">
    {glyph}
  </span>
);

/* ---------- Placeholder cover (a mini presentation slide, built in CSS) ---------- */

const SiteMock = ({ category }) => (
  <div className="flex h-full w-full flex-col overflow-hidden rounded-lg border border-[#EADFD2] bg-white">
    <div className="flex items-center gap-1 border-b border-[#EADFD2] px-2 py-1.5">
      <span className="h-1 w-1 rounded-full bg-[#FF7A3D]" />
      <span className="h-1 w-1 rounded-full bg-[#1E4DD8]" />
      <span className="h-1 w-1 rounded-full bg-[#1B1F2A]" />
      <span className="ms-1.5 h-1 w-10 rounded-full bg-[#EADFD2]" />
    </div>

    <div className="flex-1 p-2">
      {category === 'ecommerce' && (
        <div className="flex h-full flex-col gap-1.5">
          <span className="block h-8 rounded bg-[#1B1F2A]" />
          <div className="grid flex-1 grid-cols-3 gap-1.5">
            <span className="rounded bg-[#FFD9C4]" />
            <span className="rounded bg-[#DCE5FB]" />
            <span className="rounded bg-[#FFE9A8]" />
          </div>
          <span className="block h-2 w-10 rounded-full bg-[#FF7A3D]" />
        </div>
      )}

      {category === 'platforms' && (
        <div className="flex h-full gap-1.5">
          <span className="w-4 shrink-0 rounded bg-[#1B1F2A]" />
          <div className="flex flex-1 flex-col gap-1.5">
            <div className="grid grid-cols-3 gap-1.5">
              <span className="h-6 rounded bg-[#DCE5FB]" />
              <span className="h-6 rounded bg-[#FFD9C4]" />
              <span className="h-6 rounded bg-[#EADFD2]" />
            </div>
            <div className="flex flex-1 items-end gap-1">
              <span className="h-1/3 flex-1 rounded-t bg-[#1E4DD8]" />
              <span className="h-2/3 flex-1 rounded-t bg-[#FF7A3D]" />
              <span className="h-full flex-1 rounded-t bg-[#1E4DD8]" />
              <span className="h-1/2 flex-1 rounded-t bg-[#EADFD2]" />
            </div>
          </div>
        </div>
      )}

      {category === 'showcase' && (
        <div className="flex h-full flex-col gap-1.5">
          <div className="relative h-12 overflow-hidden rounded bg-[#1E4DD8] p-2">
            <span className="absolute -bottom-3 -end-3 h-10 w-10 rounded-full bg-[#FF7A3D]" />
            <span className="relative block h-1.5 w-14 rounded-full bg-white" />
            <span className="relative mt-1 block h-1 w-9 rounded-full bg-white/60" />
          </div>
          <div className="grid flex-1 grid-cols-3 gap-1.5">
            <span className="rounded bg-[#EADFD2]" />
            <span className="rounded bg-[#FFD9C4]" />
            <span className="rounded bg-[#DCE5FB]" />
          </div>
        </div>
      )}
    </div>
  </div>
);

const Cover = ({ project, number, title, categoryLabel, tags }) => (
  <div className="relative h-full w-full overflow-hidden bg-[#FBF3EA]" aria-hidden="true">
    <span className="absolute -bottom-16 -start-10 h-48 w-48 rounded-full bg-[#1E4DD8]/10" />
    <span className="absolute -top-12 end-10 h-40 w-40 rounded-full bg-[#FF7A3D]/15" />

    <div className="absolute start-4 top-1/2 w-[33%] -translate-y-1/2">
      <p className="font-mono text-[9px] font-semibold text-[#1E4DD8]" dir="ltr">
        {number}
      </p>
      <p className="mt-1 font-heading text-[15px] font-semibold leading-tight text-[#1B1F2A]">{title}</p>
      <p className="mt-1 text-[9px] text-[#5B6170]">{categoryLabel}</p>
      <span className="mt-2 block h-1 w-full rounded-full bg-[#EADFD2]" />
      <span className="mt-1 block h-1 w-5/6 rounded-full bg-[#EADFD2]" />
      <span className="mt-1 block h-1 w-2/3 rounded-full bg-[#EADFD2]" />
      <span className="mt-3 block h-0.5 w-4 bg-[#FF7A3D]" />
      <p className="mt-2 text-[7px] font-semibold uppercase tracking-wider text-[#5B6170]">{tags}</p>
    </div>

    <div className="absolute bottom-[13%] end-3 top-[13%] w-[60%]">
      <SiteMock category={project.category} />
    </div>
  </div>
);

/* ---------- Gallery card ---------- */

const ProjectCard = ({ project, number, delayMs }) => {
  const { t } = useTranslation();
  // Real projects link to their live site. Examples are not clickable.
  const href = project.liveUrl && !project.isExample ? project.liveUrl : null;
  const Tag = href ? 'a' : 'div';
  const linkProps = href ? { href, target: '_blank', rel: 'noopener noreferrer' } : {};
  const title = t(project.titleKey);
  const categoryLabel = t(`projects.categories.${project.category}`);

  return (
    <Tag
      {...linkProps}
      style={{ animationDelay: `${delayMs}ms` }}
      className={`group pj-in flex h-full w-full flex-col rounded-[24px] border p-2 transition-colors ${BORDER} ${SURFACE} ${
        href
          ? 'hover:border-[color:var(--text)] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#1E4DD8]'
          : ''
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-[18px]">
        <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none">
          {project.image ? (
            <img src={project.image} alt={title} loading="lazy" decoding="async" className="h-full w-full object-cover" />
          ) : (
            <Cover
              project={project}
              number={number}
              title={title}
              categoryLabel={categoryLabel}
              tags={t('projects.coverTags')}
            />
          )}
        </div>

        <span className="absolute start-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-medium text-[#1B1F2A]">
          {t(project.sectorKey)}
        </span>

        {href ? (
          <span className="absolute bottom-3 end-3 inline-flex items-center gap-2 rounded-full bg-[#1B1F2A] px-3 py-1.5 text-xs font-semibold text-[#FFF7EE]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22B893]" />
            {t('projects.liveSite')}
            <Arrow glyph="↗" />
          </span>
        ) : (
          project.isExample && (
            <span className="absolute bottom-3 end-3 rounded-full border border-dashed border-[#1B1F2A]/40 bg-white/85 px-2.5 py-0.5 text-[11px] font-semibold text-[#1B1F2A]">
              {t('projects.exampleBadge')}
            </span>
          )
        )}
      </div>

      <div className="flex flex-1 flex-col px-3 pb-3 pt-4">
        <div className={`flex items-center gap-3 text-xs ${MUTED}`}>
          <span className={`font-mono font-semibold ${ACCENT}`} dir="ltr">
            {number}
          </span>
          <span aria-hidden="true" className="h-px w-8 bg-[var(--border)]" />
          <span>{categoryLabel}</span>
          <span className="ms-auto font-mono" dir="ltr">
            {project.year}
          </span>
        </div>

        <h3 className={`mt-3 font-heading text-[24px] font-medium leading-tight ${TEXT}`}>{title}</h3>
        <p className={`mt-2 line-clamp-2 text-sm leading-relaxed ${MUTED}`}>{t(project.descKey)}</p>

        {href && (
          <span className="mt-5 inline-flex w-fit items-center gap-3 rounded-full bg-[#FF7A3D] py-1.5 ps-5 pe-1.5 font-heading text-sm font-semibold text-[#1B1F2A]">
            {t('projects.viewProject')}
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1B1F2A] text-[#FFF7EE]">
              <Arrow />
            </span>
          </span>
        )}
      </div>
    </Tag>
  );
};

/* ---------- Index (list) row ---------- */

const IndexRow = ({ project, number }) => {
  const { t } = useTranslation();
  const href = project.liveUrl && !project.isExample ? project.liveUrl : null;
  const Tag = href ? 'a' : 'div';
  const linkProps = href ? { href, target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <Tag
      {...linkProps}
      className={`group grid grid-cols-[2.5rem_1fr_auto] items-center gap-x-4 border-t px-2 py-5 transition-colors md:grid-cols-[3rem_1fr_11rem_4rem_2.5rem] ${BORDER} ${
        href ? 'hover:bg-[var(--surface)] focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#1E4DD8]' : ''
      }`}
    >
      <span className={`font-mono text-sm font-semibold ${ACCENT}`} dir="ltr">
        {number}
      </span>
      <div className="min-w-0">
        <h3 className={`font-heading text-xl font-medium leading-snug ${TEXT}`}>
          {t(project.titleKey)}
          {project.isExample && (
            <span className="ms-3 rounded-full border border-dashed border-[color:var(--muted)] px-2 py-0.5 align-middle text-[11px] font-semibold text-[color:var(--muted)]">
              {t('projects.exampleBadge')}
            </span>
          )}
        </h3>
        <p className={`mt-1 text-sm ${MUTED}`}>{t(project.sectorKey)}</p>
      </div>
      <span className={`hidden text-sm md:block ${MUTED}`}>{t(`projects.categories.${project.category}`)}</span>
      <span className={`hidden font-mono text-sm md:block ${MUTED}`} dir="ltr">
        {project.year}
      </span>
      <span
        className={`flex h-9 w-9 items-center justify-center justify-self-end rounded-full ${
          href ? 'bg-[#FF7A3D] text-[#1B1F2A]' : 'border border-[color:var(--border)] text-transparent'
        }`}
        aria-hidden="true"
      >
        <Arrow />
      </span>
    </Tag>
  );
};

/* ---------- Section ---------- */

export const Projects = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [filter, setFilter] = useState('all');
  const [view, setView] = useState('gallery'); // 'gallery' | 'index'
  const [activeIndex, setActiveIndex] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const trackRef = useRef(null);

  const categories = CATEGORY_ORDER.filter((c) => projects.some((p) => p.category === c));
  const visible = filter === 'all' ? projects : projects.filter((p) => p.category === filter);
  const realProjects = projects.filter((p) => !p.isExample);
  const numberOf = (project) => pad(projects.indexOf(project) + 1);

  const updateScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const first = el.firstElementChild;
    const step = first ? first.getBoundingClientRect().width + GAP_PX : 1;
    const pos = Math.abs(el.scrollLeft);
    setActiveIndex(Math.min(visible.length - 1, Math.max(0, Math.round(pos / step))));
    setAtStart(pos < 4);
    setAtEnd(pos + el.clientWidth >= el.scrollWidth - 4);
  }, [visible.length]);

  // Back to the first card when the filter or view changes; keep arrows in sync on resize
  useEffect(() => {
    trackRef.current?.scrollTo({ left: 0 });
    updateScroll();
    window.addEventListener('resize', updateScroll);
    return () => window.removeEventListener('resize', updateScroll);
  }, [filter, view, updateScroll]);

  const slide = (direction) => {
    const el = trackRef.current;
    if (!el) return;
    const first = el.firstElementChild;
    const step = (first ? first.getBoundingClientRect().width : 300) + GAP_PX;
    el.scrollBy({
      left: direction * step * (isRtl ? -1 : 1),
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  };

  const canSlide = !(atStart && atEnd);
  const eyebrowClass = `font-heading text-[12px] font-semibold tracking-[0.06em] sm:text-[13px] ${MUTED} ${
    isRtl ? '' : 'uppercase'
  }`;
  const circleBtn = `flex h-11 w-11 items-center justify-center rounded-full border transition-colors focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#1E4DD8] disabled:cursor-not-allowed disabled:opacity-35 ${BORDER} ${TEXT} enabled:hover:border-[color:var(--text)]`;

  return (
    <section
      id="projects"
      className={`scroll-mt-20 border-t py-16 md:py-24 ${BORDER}`}
      aria-labelledby="projects-heading"
    >
      <style>{`
        .pj-track { scrollbar-width: none; }
        .pj-track::-webkit-scrollbar { display: none; }
        @media (prefers-reduced-motion: no-preference) {
          .pj-in { animation: pj-in .5s ease-out both; }
          @keyframes pj-in { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
          .pj-marquee { animation: pj-marquee 30s linear infinite; }
          [dir="rtl"] .pj-marquee { animation-name: pj-marquee-rtl; }
          .pj-marquee-wrap:hover .pj-marquee { animation-play-state: paused; }
          @keyframes pj-marquee { to { transform: translateX(-50%); } }
          @keyframes pj-marquee-rtl { to { transform: translateX(50%); } }
        }
      `}</style>

      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        {/* Header: big two-tone headline on one side, text and link on the other */}
        <div className="grid gap-10 pb-12 md:grid-cols-12 md:items-end md:pb-16">
          <div className="md:col-span-7">
            <div className="mb-6 flex items-center gap-3">
              <span className={eyebrowClass}>{t('projects.eyebrowLabel')}</span>
              <span
                className={`flex h-6 min-w-6 items-center justify-center rounded-full border px-1.5 font-mono text-[11px] ${BORDER} ${TEXT}`}
                dir="ltr"
              >
                {projects.length}
              </span>
            </div>
            <h2
              id="projects-heading"
              style={{ lineHeight: isRtl ? '1.3' : '1.04', fontSize: 'clamp(40px, 6.2vw, 80px)' }}
              className={`font-heading font-semibold tracking-tight ${TEXT}`}
            >
              <span className="block">{t('projects.headline1')}</span>
              <span className={`block ${ACCENT}`}>{t('projects.headline2')}</span>
            </h2>
          </div>

          <div className="flex flex-col items-start gap-6 md:col-span-5 md:ps-10">
            <p className={`max-w-sm text-[15px] leading-relaxed ${MUTED}`}>{t('projects.subtitle')}</p>
            <a
              href="#projects-gallery"
              className={`inline-flex w-56 items-center justify-between border-b pb-2 text-sm font-medium focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#1E4DD8] ${BORDER} ${TEXT}`}
            >
              {t('projects.exploreLabel')}
              <Arrow glyph="↓" />
            </a>
          </div>
        </div>

        {/* Filter bar between two thin lines, with Galerie / Index toggle */}
        <div
          id="projects-gallery"
          className={`flex scroll-mt-24 items-center justify-between gap-4 border-y py-3 ${BORDER}`}
        >
          <div
            role="group"
            aria-label={t('projects.filtersLabel')}
            className="pj-track flex min-w-0 gap-1 overflow-x-auto"
          >
            {['all', ...categories].map((key) => {
              const active = filter === key;
              const count = key === 'all' ? projects.length : projects.filter((p) => p.category === key).length;
              const label = key === 'all' ? t('projects.tabAll') : t(`projects.tabs.${key}`);
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(key)}
                  className={`shrink-0 whitespace-nowrap rounded-md px-3.5 py-2.5 text-[13px] font-medium transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#1E4DD8] ${
                    active ? 'bg-[var(--text)] text-[color:var(--bg)]' : `${MUTED} hover:text-[color:var(--text)]`
                  }`}
                >
                  {label}
                  <sup className="ms-1.5 text-[10px]" dir="ltr">
                    {count}
                  </sup>
                </button>
              );
            })}
          </div>

          <div role="group" aria-label={t('projects.viewLabel')} className="flex shrink-0 items-center gap-4 sm:gap-5">
            {[
              ['gallery', GridIcon, 'projects.viewGallery'],
              ['index', ListIcon, 'projects.viewIndex'],
            ].map(([key, Icon, labelKey]) => (
              <button
                key={key}
                type="button"
                aria-pressed={view === key}
                onClick={() => setView(key)}
                className={`inline-flex items-center gap-1.5 border-b-2 pb-1 text-xs font-medium transition-colors focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#1E4DD8] ${
                  view === key ? `border-[color:var(--text)] ${TEXT}` : `border-transparent ${MUTED}`
                }`}
              >
                <Icon />
                <span className="sr-only sm:not-sr-only">{t(labelKey)}</span>
              </button>
            ))}
          </div>
        </div>

        <p className="sr-only" aria-live="polite">
          {visible.length === 1
            ? t('projects.displayedCountSingle')
            : t('projects.displayedCount', { count: visible.length })}
        </p>

        {/* Gallery: horizontal slider, the next card peeks in */}
        {view === 'gallery' ? (
          <div className="mt-8">
            <ul
              key={filter}
              ref={trackRef}
              onScroll={updateScroll}
              aria-label={t('projects.listLabel')}
              className="pj-track flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
            >
              {visible.map((project, i) => (
                <li key={project.id} className="w-[min(405px,85vw)] shrink-0 snap-start">
                  <ProjectCard project={project} number={numberOf(project)} delayMs={i * 70} />
                </li>
              ))}
            </ul>

            {canSlide && (
              <div className="mt-6 flex items-center gap-5">
                <p className={`font-mono text-sm ${TEXT}`} dir="ltr" aria-hidden="true">
                  {pad(activeIndex + 1)} / {pad(visible.length)}
                </p>
                <span className="relative h-0.5 flex-1 bg-[var(--border)]" aria-hidden="true">
                  <span
                    className="absolute inset-y-0 start-0 bg-[var(--text)] transition-[width] duration-300"
                    style={{ width: `${((activeIndex + 1) / visible.length) * 100}%` }}
                  />
                </span>
                <div className="flex gap-2">
                  <button type="button" onClick={() => slide(-1)} disabled={atStart} aria-label={t('projects.prev')} className={circleBtn}>
                    <Arrow glyph="←" />
                  </button>
                  <button type="button" onClick={() => slide(1)} disabled={atEnd} aria-label={t('projects.next')} className={circleBtn}>
                    <Arrow glyph="→" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <ul key={`index-${filter}`} className={`pj-in mt-2 border-b ${BORDER}`}>
            {visible.map((project) => (
              <li key={project.id}>
                <IndexRow project={project} number={numberOf(project)} />
              </li>
            ))}
          </ul>
        )}

        {/* End of section */}
        <div className="mt-16 flex flex-col items-center gap-6 text-center md:mt-20">
          <p
            style={{ lineHeight: isRtl ? '1.4' : '1.2' }}
            className={`max-w-xl font-heading text-2xl font-bold sm:text-3xl ${TEXT}`}
          >
            {t('projects.endQuestion')}
          </p>
          <Button to="/start" variant="primary">
            {t('projects.endCta')}
          </Button>
        </div>

        {/* Client names: only shown once there are at least 3 real projects */}
        {realProjects.length >= 3 && (
          <div className="mt-16 md:mt-20">
            <p className={`mb-5 text-center ${eyebrowClass}`}>{t('projects.trustClients')}</p>
            <div className="pj-marquee-wrap pj-track overflow-x-auto overflow-y-hidden">
              <ul className={`pj-marquee flex w-max items-center gap-10 font-heading text-lg font-semibold ${TEXT}`}>
                {[...realProjects, ...realProjects].map((p, i) => (
                  <li key={`${p.id}-${i}`} aria-hidden={i >= realProjects.length ? 'true' : undefined}>
                    {t(p.titleKey)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};