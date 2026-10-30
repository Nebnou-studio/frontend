import React from 'react';
import { useTranslation } from 'react-i18next';
import { BrandMark } from '../../../components/BrandBlocks';

const INK = '#1B1F2A';

/* ---------- Shared pieces ---------- */

export const Check = ({ className = '' }) => (
  <svg
    viewBox="0 0 20 20"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M4 10.5l4 4 8-9" />
  </svg>
);

// Flat avatar. mood: 'smile' (gentle), 'happy' (big smile), 'anim' (neutral, then happy)
const Avatar = ({ body = '#1E4DD8', mood = 'smile', size = 52 }) => (
  <svg viewBox="0 0 56 56" width={size} height={size} aria-hidden="true" className="shrink-0">
    <rect x="8" y="34" width="40" height="24" rx="12" fill={body} />
    <circle cx="28" cy="22" r="12" fill="#FFD9BE" />
    <circle cx="23.5" cy="21" r="1.7" fill={INK} />
    <circle cx="32.5" cy="21" r="1.7" fill={INK} />
    {mood === 'smile' && (
      <path d="M23 26.5Q28 31 33 26.5" stroke={INK} strokeWidth="1.8" strokeLinecap="round" fill="none" />
    )}
    {mood === 'happy' && <path d="M22 25.5Q28 34 34 25.5Z" fill={INK} />}
    {mood === 'anim' && (
      <>
        <path className="mood-n" d="M24.5 27.5H31.5" stroke={INK} strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path className="mood-h" d="M22 25.5Q28 34 34 25.5Z" fill={INK} />
      </>
    )}
  </svg>
);

const NamePill = ({ children }) => (
  <span className="rounded-full bg-black/30 px-2 py-0.5 text-[11px] font-semibold leading-tight text-white">
    {children}
  </span>
);

const Chip = ({ tone = 'neutral', className = '', children }) => {
  const tones = {
    neutral: 'bg-white/10 border-white/20 text-white',
    orange: 'bg-[#FF7A3D]/20 border-[#FF7A3D]/40 text-[#FF7A3D]',
    green: 'bg-[#22B893]/20 border-[#22B893]/40 text-[#22B893]',
  };
  return (
    <span
      className={`mt-5 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-heading font-semibold ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
};

const Stage = ({ children }) => (
  <div className="scene step-in flex h-full min-h-[280px] flex-col items-center justify-center p-6 text-white">
    {children}
  </div>
);

const Stamp = ({ className }) => (
  <span
    className={`${className} absolute -end-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#22B893] text-white`}
    aria-hidden="true"
  >
    <Check />
  </span>
);

const DesignThumb = ({ className = 'h-14 w-20' }) => (
  <div className={`flex flex-col gap-1 rounded-lg border border-white/10 bg-[#FFF7EE]/10 p-1.5 ${className}`}>
    <span className="h-1.5 w-full rounded-full bg-white/40" />
    <span className="h-4 w-full rounded bg-[#FF7A3D]" />
    <span className="flex gap-1">
      <span className="h-3 flex-1 rounded bg-[#1E4DD8]" />
      <span className="h-3 flex-1 rounded bg-white/25" />
      <span className="h-3 flex-1 rounded bg-white/25" />
    </span>
  </div>
);

const delay = (n) => ({ animationDelay: `calc(var(--loop) * ${n})` });

/* ---------- Step 1: online meeting ---------- */

const CallScene = () => {
  const { t } = useTranslation();
  const captions = [
    { key: 'callCaption1', dot: 'bg-[#FF7A3D]' },
    { key: 'callCaption2', dot: 'bg-[#1E4DD8]' },
    { key: 'callCaption3', dot: 'bg-[#FF7A3D]' },
  ];
  const notes = ['noteStore', 'noteCod', 'noteLang', 'noteMobile'];
  const tiles = [
    { name: 'nameExpert', body: '#1E4DD8', bg: 'bg-[#1E4DD8]/25', ring: 'ring-expert' },
    { name: 'nameClient', body: '#FF7A3D', bg: 'bg-[#FF7A3D]/25', ring: 'ring-client' },
  ];
  return (
    <Stage>
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#282D3C] p-3">
        <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold text-white/70">
          <span className="live-dot h-2 w-2 rounded-full bg-[#FF5C5C]" />
          {t('steps.visuals.callLive')}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {tiles.map((tile) => (
            <div
              key={tile.name}
              className={`relative flex h-24 flex-col items-center justify-end gap-1 rounded-xl pb-2 ${tile.bg}`}
            >
              <span className={`${tile.ring} absolute inset-0 rounded-xl border-2 border-white/80`} aria-hidden="true" />
              <Avatar body={tile.body} />
              <NamePill>{t(`steps.visuals.${tile.name}`)}</NamePill>
            </div>
          ))}
        </div>

        <div className="relative mt-3 h-14">
          {captions.map((c, i) => (
            <p
              key={c.key}
              className="cap absolute inset-0 flex items-center gap-2 rounded-xl bg-white/10 px-3 text-xs leading-snug"
              style={delay(i / 3)}
            >
              <span className={`h-2 w-2 shrink-0 rounded-full ${c.dot}`} aria-hidden="true" />
              {t(`steps.visuals.${c.key}`)}
            </p>
          ))}
        </div>

        <div className="mt-3 text-[11px] font-semibold text-white/60">{t('steps.visuals.notes')}</div>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {notes.map((k, i) => (
            <span
              key={k}
              className="note rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold"
              style={delay(0.18 + i * 0.13)}
            >
              {t(`steps.visuals.${k}`)}
            </span>
          ))}
        </div>
      </div>
      <Chip>
        <span className="h-2 w-2 rounded-full bg-[#FF7A3D]" />
        {t('steps.visualChips.discoveryCall')}
      </Chip>
    </Stage>
  );
};

/* ---------- Step 2: design sent, client approves ---------- */

const DesignScene = () => {
  const { t } = useTranslation();
  return (
    <Stage>
      <div className="w-full max-w-md">
        <div className="flex items-end justify-between gap-2">
          <div className="flex flex-col items-center gap-2">
            <div className="h-10" />
            <Avatar body="#1E4DD8" />
            <DesignThumb />
          </div>

          <div className="relative mb-5 h-10 min-w-0 flex-1">
            <span className="absolute inset-x-0 top-1/2 border-t border-dashed border-white/25" />
            <span className="fly absolute top-0 flex h-9 w-12 flex-col gap-1 rounded-md bg-white p-1" aria-hidden="true">
              <span className="h-1 rounded bg-[#1B1F2A]/30" />
              <span className="h-3 rounded bg-[#FF7A3D]" />
              <span className="h-2 rounded bg-[#1E4DD8]" />
            </span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="flex h-10 items-end">
              <p className="bubble rounded-xl rounded-ee-sm bg-white px-2.5 py-1 text-xs font-bold text-[#1B1F2A]">
                {t('steps.visuals.loveIt')}
              </p>
            </div>
            <Avatar body="#FF7A3D" mood="anim" />
            <div className="relative">
              <DesignThumb className="arrive h-14 w-20" />
              <Stamp className="stamp" />
            </div>
          </div>
        </div>

        <div className="relative mt-4 h-5 text-center text-xs font-semibold">
          <span className="st-a absolute inset-0 text-white/80">{t('steps.visuals.designSending')}</span>
          <span className="st-b absolute inset-0 text-[#22B893]">{t('steps.visuals.designApproved')}</span>
        </div>
      </div>
      <Chip tone="green">
        <Check />
        {t('steps.visualChips.freeDesign')}
      </Chip>
    </Stage>
  );
};

/* ---------- Step 3: contract signed, 20 % deposit ---------- */

const ContractScene = () => {
  const { t } = useTranslation();
  return (
    <Stage>
      <div className="flex w-full max-w-md items-center justify-between gap-3">
        <div className="flex flex-col items-center gap-1.5">
          <Avatar body="#1E4DD8" />
          <NamePill>Nebnou</NamePill>
        </div>

        <div className="sheet min-w-0 max-w-[11rem] flex-1 rounded-2xl bg-white p-4 text-[#1B1F2A]">
          <div className="mb-3 flex items-center justify-between gap-2 border-b border-[#EADFD2] pb-2">
            <span className="font-heading text-xs font-bold">{t('steps.visuals.contractTitle')}</span>
            <BrandMark size={18} />
          </div>
          <div className="mb-3 space-y-1.5">
            <span className="block h-1.5 w-full rounded-full bg-[#EADFD2]" />
            <span className="block h-1.5 w-5/6 rounded-full bg-[#EADFD2]" />
            <span className="block h-1.5 w-4/6 rounded-full bg-[#EADFD2]" />
          </div>
          <div className="border-t border-dashed border-[#EADFD2] pt-2">
            <div className="text-[10px] text-[#5B6170]">{t('steps.visuals.signature')}</div>
            <div className="relative">
              <svg viewBox="0 0 120 30" className="h-7 w-full" dir="ltr" aria-hidden="true">
                <path
                  className="sig"
                  d="M5 22C15 2 22 2 25 16S40 28 48 12S62 4 70 18S90 26 112 8"
                  stroke="#1E4DD8"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  fill="none"
                  pathLength="1"
                  strokeDasharray="1"
                />
              </svg>
              <Stamp className="stamp-mid" />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <Avatar body="#FF7A3D" mood="anim" />
          <NamePill>{t('steps.visuals.nameClient')}</NamePill>
        </div>
      </div>

      <div className="relative mt-4 h-5 w-full max-w-md text-center text-xs font-semibold">
        <span className="st-a absolute inset-0 text-white/80">{t('steps.visuals.contractSent')}</span>
        <span className="st-mid absolute inset-0 text-white/80">{t('steps.visuals.contractSigned')}</span>
        <span className="st-b absolute inset-0 text-[#22B893]">{t('steps.visuals.depositReceived')}</span>
      </div>
      <Chip tone="orange" className="late">
        {t('steps.visualChips.deposit20')}
      </Chip>
    </Stage>
  );
};

/* ---------- Step 4: developer builds, client follows ---------- */

const BuildScene = () => {
  const { t } = useTranslation();
  const codeLines = ['w-3/4 bg-[#FF7A3D]', 'w-1/2 bg-[#1E4DD8]', 'w-5/6 bg-white/40', 'w-2/3 bg-[#22B893]'];
  const tasks = ['taskHome', 'taskShop', 'taskOrders', 'taskTests'];
  return (
    <Stage>
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#282D3C] p-3">
        <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold text-white/70">
          <span className="live-dot h-2 w-2 rounded-full bg-[#22B893]" />
          {t('steps.visuals.trackLink')}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-white/5 p-3">
            <div className="flex items-center gap-2">
              <Avatar size={36} body="#1E4DD8" />
              <span className="text-[11px] font-semibold leading-tight">{t('steps.visuals.nameDev')}</span>
            </div>
            <div className="mt-3 space-y-1.5 rounded-lg bg-[#1B1F2A] p-2" dir="ltr">
              {codeLines.map((c, i) => (
                <span key={c} className={`code block h-1.5 rounded-full ${c}`} style={delay(i * 0.1)} />
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-white/5 p-3">
            <div className="flex items-center gap-2">
              <Avatar size={36} body="#FF7A3D" />
              <span className="text-[11px] font-semibold leading-tight">{t('steps.visuals.nameClient')}</span>
            </div>
            <ul className="mt-3 space-y-1.5">
              {tasks.map((k, i) => (
                <li key={k} className="flex items-center gap-2 text-[11px]">
                  <span className="task h-3 w-3 shrink-0 rounded-full bg-[#22B893]" style={delay(0.12 + i * 0.17)} />
                  {t(`steps.visuals.${k}`)}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10" dir="ltr">
          <div className="prog h-full rounded-full bg-[#FF7A3D]" />
        </div>
      </div>
      <Chip>{t('steps.visualChips.progress')}</Chip>
    </Stage>
  );
};

/* ---------- Step 5: site online, client feedback ---------- */

const Star = ({ style }) => (
  <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" className="star" style={style}>
    <path d="M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6L10 15l-5.4 3 1.2-6L1.3 7.8l6.1-.7z" fill="#FF7A3D" />
  </svg>
);

const CONFETTI = [
  [8, '#FF7A3D'],
  [22, '#1E4DD8'],
  [36, '#22B893'],
  [50, '#FFF7EE'],
  [64, '#FF7A3D'],
  [78, '#1E4DD8'],
  [90, '#22B893'],
];

const LiveScene = () => {
  const { t } = useTranslation();
  return (
    <Stage>
      <div className="relative w-full max-w-md">
        {CONFETTI.map(([x, color], i) => (
          <span
            key={x}
            aria-hidden="true"
            className="confetti pointer-events-none absolute top-0 h-2 w-2 rounded-[2px]"
            style={{ insetInlineStart: `${x}%`, background: color, ...delay(i * 0.015) }}
          />
        ))}

        <div className="sheet rounded-2xl border-2 border-[#22B893] bg-white p-3 text-[#1B1F2A]">
          <div className="mb-2 flex items-center justify-between border-b border-[#EADFD2] pb-2">
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#13795e]">
              <span className="live-dot h-2.5 w-2.5 rounded-full bg-[#22B893]" />
              {t('steps.visuals.live')}
            </span>
            <span className="font-mono text-[10px] text-[#5B6170]" dir="ltr">
              votresite.dz
            </span>
          </div>
          <div className="flex gap-2 rounded-xl border border-[#EADFD2] bg-[#FFF7EE] p-2">
            <div className="flex-1 space-y-1.5">
              <span className="block h-2 w-3/4 rounded-full bg-[#FF7A3D]" />
              <span className="block h-1.5 w-1/2 rounded-full bg-[#1B1F2A]/30" />
              <span className="mt-1 block h-4 w-14 rounded-full bg-[#1E4DD8]" />
            </div>
            <div className="grid w-20 grid-cols-2 gap-1">
              <span className="h-6 rounded bg-[#EADFD2]" />
              <span className="h-6 rounded bg-[#EADFD2]" />
              <span className="h-6 rounded bg-[#EADFD2]" />
              <span className="h-6 rounded bg-[#EADFD2]" />
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3 rounded-2xl bg-white/10 p-3">
          <Avatar body="#FF7A3D" mood="happy" size={44} />
          <div className="min-w-0 flex-1">
            <div className="flex gap-0.5" role="img" aria-label={t('steps.visuals.rating')}>
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} style={delay(0.3 + i * 0.04)} />
              ))}
            </div>
            <p className="fb mt-1 text-xs leading-snug">{t('steps.visuals.feedback')}</p>
          </div>
        </div>
      </div>
      <Chip tone="green">
        <Check />
        {t('steps.visualChips.online80')}
      </Chip>
    </Stage>
  );
};

export const VISUALS = [CallScene, DesignScene, ContractScene, BuildScene, LiveScene];

/* ---------- Styles: final state by default, animations loop only if motion is allowed ---------- */

export const StepVisualStyles = () => (
  <style>{`
    .scene { --loop: 8s; }
    .mood-n, .st-a, .st-mid, .fly, .cap, .ring-expert, .ring-client, .confetti { opacity: 0; }
    .mood-h { opacity: 1; }
    .cap:last-child { opacity: 1; }
    .prog { width: 65%; }
    .sig { stroke-dashoffset: 0; }

    @media (prefers-reduced-motion: no-preference) {
      .step-in { animation: step-in .55s cubic-bezier(.22,1,.36,1) both; }
      @keyframes step-in { from { opacity: 0; transform: translateY(16px) scale(.97); } to { opacity: 1; transform: none; } }

      .live-dot { animation: blink 1.4s ease-in-out infinite; }
      @keyframes blink { 50% { opacity: .3; } }

      .mood-n { opacity: 1; animation: moodN var(--loop) infinite; }
      .mood-h { opacity: 0; animation: moodH var(--loop) infinite; }
      @keyframes moodN { 0%, 55% { opacity: 1; } 60%, 96% { opacity: 0; } 100% { opacity: 1; } }
      @keyframes moodH { 0%, 55% { opacity: 0; } 60%, 96% { opacity: 1; } 100% { opacity: 0; } }

      .cap { animation: cap var(--loop) infinite both; }
      @keyframes cap { 0% { opacity: 0; } 3%, 30% { opacity: 1; } 33%, 100% { opacity: 0; } }
      .ring-expert { animation: ringE var(--loop) infinite; }
      .ring-client { animation: ringC var(--loop) infinite; }
      @keyframes ringE { 0%, 31% { opacity: 0; } 33%, 64% { opacity: 1; } 66%, 100% { opacity: 0; } }
      @keyframes ringC { 0%, 30% { opacity: 1; } 33%, 64% { opacity: 0; } 66%, 100% { opacity: 1; } }

      .note { animation: pop var(--loop) infinite both; }
      @keyframes pop { 0% { opacity: 0; transform: scale(.85); } 4% { opacity: 1; transform: scale(1); } 92% { opacity: 1; } 100% { opacity: 0; } }

      .fly { animation: fly var(--loop) infinite both; }
      @keyframes fly {
        0% { opacity: 0; inset-inline-start: 0; }
        6% { opacity: 1; }
        38% { opacity: 1; inset-inline-start: calc(100% - 3rem); }
        44%, 100% { opacity: 0; inset-inline-start: calc(100% - 3rem); }
      }
      .arrive { animation: arrive var(--loop) infinite both; }
      @keyframes arrive { 0%, 42% { opacity: 0; } 48%, 94% { opacity: 1; } 100% { opacity: 0; } }

      .stamp, .bubble, .late { animation: late var(--loop) infinite both; }
      @keyframes late { 0%, 56% { opacity: 0; transform: scale(.6); } 62%, 94% { opacity: 1; transform: scale(1); } 100% { opacity: 0; } }
      .stamp-mid { animation: mid var(--loop) infinite both; }
      @keyframes mid { 0%, 42% { opacity: 0; transform: scale(.6); } 48%, 94% { opacity: 1; transform: scale(1); } 100% { opacity: 0; } }

      .st-a { animation: stA var(--loop) infinite both; }
      .st-mid { animation: stM var(--loop) infinite both; }
      .st-b { animation: stB var(--loop) infinite both; }
      @keyframes stA { 0% { opacity: 0; } 4%, 40% { opacity: 1; } 46%, 100% { opacity: 0; } }
      @keyframes stM { 0%, 44% { opacity: 0; } 48%, 57% { opacity: 1; } 61%, 100% { opacity: 0; } }
      @keyframes stB { 0%, 58% { opacity: 0; } 62%, 94% { opacity: 1; } 100% { opacity: 0; } }

      .sheet { animation: sheet var(--loop) infinite both; }
      @keyframes sheet { 0% { opacity: 0; transform: scale(.92); } 6% { opacity: 1; transform: scale(1); } 94% { opacity: 1; } 100% { opacity: 0; } }
      .sig { animation: sig var(--loop) infinite both; }
      @keyframes sig { 0%, 22% { stroke-dashoffset: 1; } 42%, 96% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: 1; } }

      .code { transform-origin: left; animation: code var(--loop) infinite both; }
      @keyframes code { 0% { transform: scaleX(0); } 14%, 90% { transform: scaleX(1); } 100% { transform: scaleX(0); } }
      .task { animation: task var(--loop) infinite both; }
      @keyframes task { 0%, 4% { background: rgba(255,255,255,.2); } 8%, 92% { background: #22B893; } 100% { background: rgba(255,255,255,.2); } }
      .prog { animation: prog var(--loop) infinite both; }
      @keyframes prog { 0% { width: 0; } 85%, 96% { width: 65%; } 100% { width: 0; } }

      .star { animation: star var(--loop) infinite both; }
      @keyframes star { 0%, 30% { opacity: .25; transform: scale(.8); } 36% { opacity: 1; transform: scale(1.15); } 40%, 94% { opacity: 1; transform: scale(1); } 100% { opacity: .25; } }
      .fb { animation: fb var(--loop) infinite both; }
      @keyframes fb { 0%, 40% { opacity: 0; } 48%, 94% { opacity: 1; } 100% { opacity: 0; } }
      .confetti { animation: confetti var(--loop) infinite both; }
      @keyframes confetti { 0% { opacity: 0; transform: translateY(-8px) rotate(0); } 6% { opacity: 1; } 30% { opacity: 0; transform: translateY(120px) rotate(200deg); } 100% { opacity: 0; } }
    }
  `}</style>
);