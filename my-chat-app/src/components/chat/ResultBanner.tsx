interface Props {
  kind: 'success' | 'out';
  friction: number;
  target: number;
  turnsUsed: number;
  pronoun: 'she' | 'he';
  onResults: () => void;
}

export function ResultBanner({ kind, friction, target, turnsUsed, pronoun, onResults }: Props) {
  const ok = kind === 'success';
  return (
    <div
      className={`flex animate-rise flex-wrap items-center gap-x-4 gap-y-2.5 border-b px-[clamp(12px,2vw,20px)] py-3 ${
        ok ? 'border-[#BFE6CC] bg-good-soft' : 'border-bad-line bg-bad-soft'
      }`}
    >
      <div className="min-w-0 flex-[1_1_220px]">
        <div className={`text-[15px] font-bold ${ok ? 'text-[#14532D]' : 'text-[#7F1D1D]'}`}>
          {ok ? `🎉 Target reached — ${pronoun}’s aligned` : 'No turns left'}
        </div>
        <div className={`text-[13px] ${ok ? 'text-[#166534]' : 'text-[#991B1B]'}`}>
          {ok ? `Friction down to ${friction} in ${turnsUsed} turns.` : `Friction finished at ${friction}. Target was ≤${target}.`}
        </div>
      </div>
      <button
        onClick={onResults}
        className={`h-10 rounded-[10px] px-[18px] text-sm font-bold text-white ${ok ? 'bg-good-ink hover:bg-[#166534]' : 'bg-ink hover:bg-body'}`}
      >
        See my results
      </button>
    </div>
  );
}
