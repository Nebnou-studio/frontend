import React from 'react';

/**
 * The brand mark graphic device: three rounded blocks
 * Blue vertical foundation, Orange horizontal roof, Ink pillar.
 * Never distorted.
 */
export const BrandMark = ({ size = 32, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      <rect x="0" y="0" width="38" height="120" rx="14" fill="#1E4DD8" />
      <rect x="44" y="0" width="76" height="38" rx="14" fill="#FF7A3D" />
      <rect x="82" y="44" width="38" height="76" rx="14" fill="#1B1F2A" />
    </svg>
  );
};

export const BrandMarkReverse = ({ size = 32, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      <rect x="0" y="0" width="38" height="120" rx="14" fill="#1E4DD8" />
      <rect x="44" y="0" width="76" height="38" rx="14" fill="#FF7A3D" />
      <rect x="82" y="44" width="38" height="76" rx="14" fill="#FFF7EE" />
    </svg>
  );
};

/**
 * Large decorative background / section divider motif
 */
export const BrandDecorativeBlocks = ({ className = '', opacity = 1 }) => {
  return (
    <div className={`relative pointer-events-none select-none ${className}`} aria-hidden="true" style={{ opacity }}>
      <div className="flex items-start gap-3">
        <div className="w-12 h-36 rounded-2xl bg-[#1E4DD8]" />
        <div className="flex flex-col gap-3">
          <div className="w-28 h-12 rounded-2xl bg-[#FF7A3D]" />
          <div className="w-12 h-20 self-end rounded-2xl bg-[#1B1F2A]" />
        </div>
      </div>
    </div>
  );
};
