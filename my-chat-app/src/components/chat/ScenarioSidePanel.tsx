import type { Scenario } from '@/types/scenario';
import { ReferencePanel } from './panelRegistry';

interface Props {
  scenario: Scenario;
  onBack?: () => void;
}

export function ScenarioSidePanel({ scenario: sc, onBack }: Props) {
  return (
    <div className="flex flex-col gap-[22px] px-[clamp(16px,2vw,24px)] pt-5 pb-7">
      {onBack && (
        <button onClick={onBack} className="self-start py-1 text-sm font-semibold text-primary hover:text-primary-hover hover:underline">
          ← Briefing
        </button>
      )}

      <div className="flex flex-col gap-2">
        <span className="self-start rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary">
          {sc.category} · {sc.type}
        </span>
        <h2 className="m-0 text-[19px] leading-snug font-extrabold tracking-tight text-balance text-ink">{sc.title}</h2>
      </div>

      <div className="flex items-start gap-3 rounded-[14px] bg-page p-3.5">
        <div className="flex min-w-0 flex-col gap-0.5">
          <div className="text-[15px] font-bold text-ink">{sc.character.name}</div>
          <div className="text-[13px] text-muted">
            {sc.character.role}, {sc.character.org}
          </div>
          <div className="mt-1 text-[13px] leading-snug text-[#475467] italic">“{sc.personality}”</div>
        </div>
      </div>

      <div className="rounded-[14px] bg-primary-soft px-4 py-3.5">
        <div className="mb-1 text-xs font-bold text-primary">Your goal</div>
        <div className="text-sm leading-normal text-primary-ink">{sc.goal}</div>
      </div>

      <ReferencePanel reference={sc.reference} />

      <div className="flex flex-col gap-2">
        <div className="text-[13px] font-bold text-body">Don'ts</div>
        {sc.dos.map((r) => (
          <div key={r.topic} className="flex items-start gap-2 text-[13px] leading-snug text-[#475467]">
            <span className="mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-bad-soft text-bad">
              <svg viewBox="0 0 24 24" width="9" height="9" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </span>
            <span>{r.dont}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
