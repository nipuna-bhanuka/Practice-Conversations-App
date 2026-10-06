import type { Scenario } from '@/types/scenario';
import { pronoun, zoneGradient } from '@/lib/format';

interface Props {
  scenario: Scenario;
  onStart: () => void;
}

function steps(s: Scenario) {
  return [`Read objection`, 'Reply in your own words', 'Watch the score move'];
}

function Steps({ scenario }: { scenario: Scenario }) {
  return (
    <div className="flex flex-col gap-3">
      {steps(scenario).map((text, i) => (
        <div key={text} className="flex items-center gap-3 text-[15px] text-body">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-soft text-[13px] font-extrabold text-primary">{i + 1}</span>
          {text}
        </div>
      ))}
    </div>
  );
}

/** Sticky card on desktop */
export function HowItWorksCard({ scenario: s, onStart }: Props) {
  const { start, target } = s.metric;
  return (
    <div className="flex flex-col gap-[22px] rounded-2xl border border-line bg-white p-6 shadow-[0_12px_32px_-16px_rgba(16,24,40,.18)]">
      <h3 className="m-0 text-[17px] font-bold">How it works</h3>

      <div className="flex flex-col gap-2.5">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-semibold text-body">Friction score</span>
          <span className="text-[13px] text-subtle">lower is better</span>
        </div>
        <div className="flex items-baseline gap-2.5">
          <span className="text-[34px] font-extrabold tracking-tight text-bad">{start}</span>
          <span className="text-base text-subtle">→</span>
          <span className="text-[34px] font-extrabold tracking-tight text-good">≤{target}</span>
        </div>
        <div className="relative mt-1 h-2.5 rounded-full" style={{ background: zoneGradient(target) }}>
          <div className="absolute inset-y-0 left-0 rounded-full bg-bad" style={{ width: `${start}%` }} />
          <div className="absolute -top-[5px] -bottom-[5px] -ml-px w-0.5 rounded-sm bg-ink" style={{ left: `${target}%` }} />
        </div>
        <div className="relative h-4">
          <span className="absolute -translate-x-1/2 text-xs font-bold whitespace-nowrap text-good-ink" style={{ left: `${target}%` }}>Target ≤{target}</span>
          <span className="absolute -translate-x-1/2 text-xs font-bold whitespace-nowrap text-bad-ink" style={{ left: `${start}%` }}>Start</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="rounded-xl bg-page px-3.5 py-3">
          <div className="text-xl font-extrabold">{s.maxTurns}</div>
          <div className="text-[13px] text-muted">turns maximum</div>
        </div>
        <div className="rounded-xl bg-warn-soft px-3.5 py-3">
          <div className="text-xl font-extrabold text-warn-ink">Hints</div>
          <div className="text-[13px] text-[#8A5A12]">available anytime</div>
        </div>
      </div>

      <Steps scenario={s} />

      <button
        onClick={onStart}
        className="h-[54px] w-full rounded-xl bg-primary text-base font-bold text-white shadow-[0_8px_18px_-8px_rgba(67,56,202,.7)] transition hover:-translate-y-px hover:bg-primary-hover"
      >
        Start Chat →
      </button>
    </div>
  );
}

/** Inline card shown in the main column on mobile */
export function HowItWorksInline({ scenario }: { scenario: Scenario }) {
  return (
    <div className="flex flex-col gap-3.5 rounded-2xl border border-line bg-white p-5">
      <h2 className="m-0 text-lg font-bold">How it works</h2>
      <Steps scenario={scenario} />
      <div className="text-sm text-muted">{scenario.maxTurns} turns maximum · Hints available when you're stuck</div>
    </div>
  );
}

/** Fixed bottom bar on mobile */
export function StartChatBar({ scenario: s, onStart }: Props) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-line bg-white px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] shadow-[0_-10px_24px_-14px_rgba(16,24,40,.25)]">
      <div className="min-w-0 flex-1">
        <div className="text-xs text-muted">Friction · {s.maxTurns} turns</div>
        <div className="text-base font-extrabold">
          <span className="text-bad">{s.metric.start}</span> <span className="font-medium text-subtle">→</span> <span className="text-good">≤{s.metric.target}</span>
        </div>
      </div>
      <button onClick={onStart} className="h-12 rounded-xl bg-primary px-[22px] text-[15px] font-bold text-white hover:bg-primary-hover">
        Start Chat →
      </button>
    </div>
  );
}
