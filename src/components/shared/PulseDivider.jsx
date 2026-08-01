// ═══════════════════════════════════════════════════════════
// PulseDivider — SVG ECG-trace divider
// ═══════════════════════════════════════════════════════════

import React from 'react';

export default function PulseDivider({ className = '' }) {
  return (
    <div className={`flex items-center justify-center opacity-40 ${className}`}>
      <svg width="100%" height="12" viewBox="0 0 100 12" preserveAspectRatio="none" className="max-w-[400px]">
        <polyline
          points="0,6 40,6 45,2 50,10 55,6 100,6"
          fill="none"
          stroke="var(--rule)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
