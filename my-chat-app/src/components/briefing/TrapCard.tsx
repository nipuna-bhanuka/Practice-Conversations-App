import type { Trap } from '@/types/scenario';

export function TrapCard({ trap }: { trap: Trap }) {
  return (
    <div className="flex h-full flex-col gap-2 rounded-[14px] border border-[#F3E3C3] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,.04)]">
      <div className="flex items-center justify-between gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FEF3E2] text-[15px] font-extrabold text-warn-ink">!</span>
        <span className="rounded-full bg-bad-soft px-2.5 py-0.5 text-[13px] font-bold text-bad-ink">+{trap.penalty}</span>
      </div>
      <div className="text-[15px] font-bold text-ink">{trap.name}</div>
      <div className="text-sm leading-normal text-muted">{trap.description}</div>
    </div>
  );
}
