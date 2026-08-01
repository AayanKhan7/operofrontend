// ═══════════════════════════════════════════════════════════
// StatusBadge — Small text badge with status color (v3)
// ═══════════════════════════════════════════════════════════

import React from 'react';

const STATUS_STYLES = {
  'Scheduled':  { bg: 'bg-rule/40',        text: 'text-navy',         dot: 'bg-rule' },
  'Checked-In': { bg: 'bg-sky/10',         text: 'text-sky',          dot: 'bg-sky' },
  'With Nurse':  { bg: 'bg-amber/10',      text: 'text-amber',        dot: 'bg-amber' },
  'With Doctor': { bg: 'bg-plum/10',       text: 'text-plum',         dot: 'bg-plum' },
  'Completed':  { bg: 'bg-whatsapp-green/10', text: 'text-whatsapp-green', dot: 'bg-whatsapp-green' },
  'No-Show':    { bg: 'bg-rust/10',        text: 'text-rust',         dot: 'bg-rust' },
  'Cancelled':  { bg: 'bg-rust/10',        text: 'text-rust',         dot: 'bg-rust' },
  'Pending':    { bg: 'bg-amber/10',       text: 'text-amber',        dot: 'bg-amber' },
  'Paid':       { bg: 'bg-whatsapp-green/10', text: 'text-whatsapp-green', dot: 'bg-whatsapp-green' },
  'Active':     { bg: 'bg-whatsapp-green/10', text: 'text-whatsapp-green', dot: 'bg-whatsapp-green' },
  'Inactive':   { bg: 'bg-rule/40',        text: 'text-navy/50',      dot: 'bg-rule' },
};

export default function StatusBadge({ status, size = 'sm' }) {
  const styles = STATUS_STYLES[status] || STATUS_STYLES['Scheduled'];
  const sizeClasses = size === 'xs' ? 'text-[0.625rem] px-[6px] py-[1px]' : 'text-xs px-2 py-[2px]';

  return (
    <span
      className={`inline-flex items-center gap-[5px] rounded-md font-sans font-medium ${styles.bg} ${styles.text} ${sizeClasses}`}
    >
      <span className={`w-[5px] h-[5px] rounded-full ${styles.dot} flex-shrink-0`} />
      {status}
    </span>
  );
}
