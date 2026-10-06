import type { DoDont } from '@/types/scenario';

export function DoDontRow({ row }: { row: DoDont }) {
  return (
    <div className="flex flex-col gap-2.5 border-t border-line-soft py-[18px]">
      <div className="text-[15px] font-bold text-ink">{row.topic}</div>
      <div className="grid gap-2.5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr))]">
        <div className="flex gap-2.5 rounded-xl border border-[#D5EFDD] bg-[#F0FAF3] px-3.5 py-3">
          <span className="mt-px flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-good text-white">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5 9-10" /></svg>
          </span>
          <div className="min-w-0">
            <div className="mb-0.5 text-xs font-bold text-good-ink">Do</div>
            <div className="text-sm leading-normal text-[#14532D]">{row.do}</div>
          </div>
        </div>
        <div className="flex gap-2.5 rounded-xl border border-[#F7D6D6] bg-[#FEF3F3] px-3.5 py-3">
          <span className="mt-px flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-bad text-white">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </span>
          <div className="min-w-0">
            <div className="mb-0.5 text-xs font-bold text-bad-ink">Don't</div>
            <div className="text-sm leading-normal text-[#7F1D1D]">{row.dont}</div>
          </div>
        </div>
      </div>
      <div className="text-[13px] leading-normal text-subtle">Why: {row.why}</div>
    </div>
  );
}
