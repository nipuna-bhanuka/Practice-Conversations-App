import { useState } from 'react';
import type { Feedback } from '@/types/chat';

const STYLES = {
  strong: { cls: 'bg-good-soft text-good-ink border-[#BFE6CC]', icon: '✓ ' },
  good: { cls: 'bg-[#EFF8F2] text-good-ink border-[#CDEBD7]', icon: '✓ ' },
  neutral: { cls: 'bg-[#F2F4F7] text-[#475467] border-[#E1E4EA]', icon: '' },
  trap: { cls: 'bg-bad-soft text-bad-ink border-bad-line', icon: '⚠ ' },
} as const;

export function FeedbackChip({ feedback }: { feedback: Feedback }) {
  const [open, setOpen] = useState(false);
  const s = STYLES[feedback.kind];
  return (
    <div className="flex max-w-[min(420px,80vw)] animate-pop flex-col items-end gap-1.5">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold transition-shadow hover:shadow-[0_2px_8px_-2px_rgba(16,24,40,.18)] ${s.cls}`}
      >
        {s.icon}
        {feedback.label}
        <span className="text-[10px] opacity-70">{open ? '▴' : '▾'}</span>
      </button>
      {open && (
        <div className="animate-rise rounded-[10px] border border-line bg-white px-3 py-2 text-[13px] leading-snug text-body shadow-[0_6px_16px_-6px_rgba(16,24,40,.16)]">
          {feedback.note}
          {feedback.upgrade && (
            <div className="mt-1.5 border-t border-dashed border-line pt-1.5 text-good-ink">
              <span className="font-bold">Try: </span>“{feedback.upgrade}”
            </div>
          )}
        </div>
      )}
    </div>
  );
}
