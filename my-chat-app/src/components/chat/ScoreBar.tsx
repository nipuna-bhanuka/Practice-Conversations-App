import { formatDelta, frictionColor, zoneGradient } from '@/lib/format';
import { TurnDots } from './TurnDots';

interface Props {
  label: string;
  value: number;
  target: number;
  delta: number | null;
  deltaKey: number;
  turnsUsed: number;
  maxTurns: number;
}

export function ScoreBar({ label, value, target, delta, deltaKey, turnsUsed, maxTurns }: Props) {
  const color = frictionColor(value, target);
  const left = Math.max(0, maxTurns - turnsUsed);
  const pill =
    delta === null
      ? null
      : delta < 0
        ? 'bg-good-soft text-good-ink'
        : delta > 0
          ? 'bg-bad-soft text-bad-ink'
          : 'bg-[#EEF0F4] text-muted';

  return (
    <div className="flex flex-wrap items-center gap-x-7 gap-y-2.5 border-b border-line bg-white px-[clamp(14px,2.5vw,24px)] pt-3 pb-3.5">
      <div className="flex min-w-[130px] flex-col">
        <span className="text-xs font-semibold text-muted">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-[30px] leading-tight font-extrabold tracking-tight tabular-nums transition-colors duration-500" style={{ color }}>
            {value}
          </span>
          {pill && (
            <span key={deltaKey} className={`animate-pop rounded-full px-2 py-0.5 text-[13px] font-bold ${pill}`}>
              {formatDelta(delta!)}
            </span>
          )}
        </div>
      </div>

      <div className="min-w-[200px] flex-[1_1_240px] pb-4">
        <div
          className="relative h-2.5 rounded-full"
          style={{ background: zoneGradient(target) }}
          role="meter"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={value}
          aria-label={label}
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-[width,background] duration-700 ease-[cubic-bezier(.2,.8,.2,1)]"
            style={{ width: `${value}%`, background: color }}
          />
          <div className="absolute -top-[5px] -bottom-[5px] -ml-px w-0.5 rounded-sm bg-ink" style={{ left: `${target}%` }} />
          <span className="absolute top-4 -translate-x-1/2 text-[11px] font-bold whitespace-nowrap text-good-ink" style={{ left: `${target}%` }}>
            Target ≤{target}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-start gap-1.5">
        <span className="text-xs font-semibold text-muted">
          Turns left:{' '}
          <strong className="text-ink">
            {left} / {maxTurns}
          </strong>
        </span>
        <TurnDots used={turnsUsed} total={maxTurns} />
      </div>
    </div>
  );
}
