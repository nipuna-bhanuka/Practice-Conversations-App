import type { Character } from '@/types/scenario';

interface Props {
  character: Character;
  typing: boolean;
  voiceOn: boolean;
  onToggleVoice: () => void;
  onBack: () => void;
  onInfo: () => void;
  onEnd: () => void;
}

const iconBtn = 'flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full text-body hover:bg-[#F2F4F7]';

export function ChatHeader({ character, typing, voiceOn, onToggleVoice, onBack, onInfo, onEnd }: Props) {
  return (
    <div className="flex min-h-[66px] items-center gap-2.5 border-b border-line-soft bg-white px-[clamp(10px,2vw,20px)] py-2.5">
      <button onClick={onBack} aria-label="Back" className={`${iconBtn} md:hidden`}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
      </button>

      <div className="min-w-0 flex-1">
        <div className="truncate text-base font-bold">{character.name}</div>
        <div className="truncate text-[13px] text-muted">
          {character.role} · <span className={`font-semibold ${typing ? 'text-primary' : 'text-good'}`}>{typing ? 'typing…' : 'online'}</span>
        </div>
      </div>

      <button onClick={onInfo} aria-label="Scenario info" className={`${iconBtn} md:hidden`}>
        <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg>
      </button>

      <button
        onClick={onToggleVoice}
        aria-label="Toggle voice"
        aria-pressed={voiceOn}
        title={voiceOn ? 'Voice on' : 'Voice off'}
        className={`flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full hover:bg-primary-soft ${voiceOn ? 'bg-primary-soft text-primary' : 'text-[#667085]'}`}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 9v6h4l5 4V5L8 9H4z" />
          {voiceOn ? <path d="M16.5 9a4 4 0 010 6M19 6.5a7.5 7.5 0 010 11" /> : <path d="M17 9.5l5 5M22 9.5l-5 5" />}
        </svg>
      </button>

      <button onClick={onEnd} className="h-9 shrink-0 rounded-[10px] border border-bad-line bg-white px-3.5 text-sm font-semibold text-bad-ink hover:bg-[#FEF3F3]">
        <span className="md:hidden">End</span>
        <span className="hidden md:inline">End session</span>
      </button>
    </div>
  );
}
