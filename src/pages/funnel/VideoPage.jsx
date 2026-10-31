import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFunnel } from '../../context/FunnelContext';
import { Arrow, Check, BORDER, MUTED, TEXT, primaryBtn } from './funnelUi';

const VIDEO_URL = import.meta.env.VITE_VIDEO_URL;
const VIDEO_POSTER = import.meta.env.VITE_VIDEO_POSTER;
const UNLOCK_AT = 0.5; // share of the video that must be watched

export default function VideoPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { videoWatched, markVideoWatched } = useFunnel();
  const isRtl = (i18n.language || '').startsWith('ar');

  const [progress, setProgress] = useState(videoWatched ? 1 : 0); // 0 to 1 toward the unlock point
  const watchedRef = useRef(0); // seconds really watched
  const lastTimeRef = useRef(0);

  // Without a video URL (development) the button is available right away
  const unlocked = videoWatched || !VIDEO_URL;

  // Counts only natural playback, so skipping ahead does not unlock the button
  const handleTimeUpdate = (e) => {
    const video = e.currentTarget;
    const { duration, currentTime, paused } = video;
    if (!duration || !Number.isFinite(duration)) return;

    const delta = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;
    if (!paused && delta > 0 && delta < 1.5) watchedRef.current += delta;

    const next = Math.min(1, watchedRef.current / (duration * UNLOCK_AT));
    setProgress(next);
    if (next >= 1) markVideoWatched();
  };

  const goNext = () => {
    markVideoWatched();
    navigate('/start/questions');
  };

  const trust = [
    ['hero.trust1', 'bg-[#1E4DD8]'],
    ['hero.trust2', 'bg-[#FF7A3D]'],
    ['hero.trust3', 'bg-[#1B1F2A] dark:bg-[#FFF7EE]'],
  ];

  return (
    <section aria-labelledby="funnel-video-title" className="mx-auto max-w-[860px] text-center">
      <div className={`fn-in mb-6 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 ${BORDER} bg-[var(--surface)]`}>
        <span className="h-2 w-2 rounded-full bg-[#FF7A3D]" aria-hidden="true" />
        <span className={`font-heading text-[12px] font-semibold tracking-[0.06em] sm:text-[13px] ${TEXT} ${isRtl ? '' : 'uppercase'}`}>
          {t('funnel.video.eyebrow')}
        </span>
      </div>

      <h1
        id="funnel-video-title"
        style={{ lineHeight: isRtl ? '1.35' : '1.1' }}
        className={`fn-in font-heading text-[32px] font-bold tracking-tight sm:text-[46px] lg:text-[54px] ${TEXT}`}
      >
        {t('funnel.video.title')}
      </h1>
      <p className={`fn-in mx-auto mt-4 max-w-[56ch] text-[17px] leading-relaxed sm:text-[19px] ${MUTED}`}>
        {t('funnel.video.subtitle')}
      </p>

      {/* Video */}
      <div className={`fn-in mt-8 aspect-video overflow-hidden rounded-[28px] border bg-[#1B1F2A] ${BORDER}`}>
        {VIDEO_URL ? (
          <video
            className="h-full w-full object-cover"
            src={VIDEO_URL}
            poster={VIDEO_POSTER || undefined}
            controls
            controlsList="nodownload"
            playsInline
            preload="metadata"
            aria-label={t('funnel.video.videoLabel')}
            onTimeUpdate={handleTimeUpdate}
            onSeeking={(e) => {
              lastTimeRef.current = e.currentTarget.currentTime;
            }}
          />
        ) : (
          <div className="grid h-full w-full place-items-center p-6">
            <div className="flex flex-col items-center gap-4">
              <svg viewBox="0 0 120 120" className="h-16 w-16" aria-hidden="true">
                <rect width="38" height="120" rx="14" fill="#1E4DD8" />
                <rect x="44" width="76" height="38" rx="14" fill="#FF7A3D" />
                <rect x="82" y="44" width="38" height="76" rx="14" fill="#FFF7EE" />
              </svg>
              <p className="font-heading text-sm font-semibold text-[#FFF7EE]/80">{t('funnel.video.noVideo')}</p>
            </div>
          </div>
        )}
      </div>

      {/* Hint, then the button once half of the video has been watched */}
      <div className="mt-8 min-h-[112px]" aria-live="polite">
        {unlocked ? (
          <div className="fn-in flex flex-col items-center gap-4">
            {VIDEO_URL && (
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#13795e] dark:text-[#22B893]">
                <Check />
                {t('funnel.video.ready')}
              </p>
            )}
            <button type="button" onClick={goNext} className={primaryBtn}>
              {t('funnel.video.continue')}
              <Arrow />
            </button>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-[420px]">
            <p className={`mb-3 text-sm font-medium ${MUTED}`}>{t('funnel.video.hint')}</p>
            <div
              className="h-1.5 overflow-hidden rounded-full bg-[var(--border)]"
              role="progressbar"
              aria-label={t('funnel.video.hint')}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress * 100)}
            >
              <div
                className="h-full rounded-full bg-[#FF7A3D] transition-[width] duration-300"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <ul className={`mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t pt-6 font-heading text-xs font-semibold sm:text-sm ${BORDER} ${TEXT}`}>
        {trust.map(([key, color]) => (
          <li key={key} className="inline-flex items-center gap-2">
            <span className={`h-3.5 w-3.5 rounded-sm ${color}`} aria-hidden="true" />
            {t(key)}
          </li>
        ))}
      </ul>
    </section>
  );
}