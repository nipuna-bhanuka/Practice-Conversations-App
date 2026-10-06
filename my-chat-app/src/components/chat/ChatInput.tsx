import { useState } from 'react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

interface Props {
  onSend: (text: string) => Promise<boolean>;
  disabled?: boolean;
  busy?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, disabled = false, busy = false, placeholder = 'Type your reply…' }: Props) {
  const [draft, setDraft] = useState('');
  const mic = useSpeechRecognition(setDraft);
  const canSend = !disabled && !busy && draft.trim().length > 0;

  const submit = async () => {
    if (!canSend) return;
    mic.stop();
    const text = draft;
    setDraft('');
    const ok = await onSend(text);
    if (!ok) setDraft(text); // give the text back if sending failed
  };

  return (
    <div className="flex items-center gap-2 bg-composer px-[clamp(10px,2vw,20px)] pt-2.5 pb-[calc(12px+env(safe-area-inset-bottom))]">
      <div
        className={`flex min-h-12 min-w-0 flex-1 items-center gap-1 rounded-full bg-white pr-[5px] pl-[18px] shadow-[0_1px_2px_rgba(16,24,40,.08)] ${
          mic.listening ? 'ring-2 ring-primary' : ''
        }`}
      >
        <textarea
          rows={1}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              void submit();
            }
          }}
          disabled={disabled}
          placeholder={mic.listening ? 'Listening…' : placeholder}
          aria-label="Your reply"
          className="max-h-32 min-w-0 flex-1 resize-none border-0 bg-transparent py-3 text-[15px] leading-normal text-ink outline-none [field-sizing:content] placeholder:text-subtle"
        />
        {mic.supported && (
          <button
            type="button"
            onClick={mic.toggle}
            disabled={disabled}
            aria-label={mic.listening ? 'Stop recording' : 'Voice reply'}
            aria-pressed={mic.listening}
            className={`flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full transition-colors ${
              mic.listening ? 'animate-pulse bg-bad-soft text-bad' : 'text-[#667085] hover:bg-[#F2F4F7] hover:text-primary'
            }`}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="9" y="3" width="6" height="11" rx="3" />
              <path d="M5 11a7 7 0 0014 0M12 18v3" />
            </svg>
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={() => void submit()}
        disabled={!canSend}
        aria-label="Send"
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white shadow-[0_4px_12px_-4px_rgba(67,56,202,.5)] transition hover:scale-105 disabled:hover:scale-100 ${
          disabled ? 'bg-[#C9CEDA] shadow-none' : canSend ? 'bg-primary' : 'bg-[#6366F1]'
        }`}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="ml-0.5">
          <path d="M3.4 20.4l17.5-7.5a1 1 0 000-1.8L3.4 3.6a.7.7 0 00-1 .8L4.5 11l9 1-9 1-2.1 6.6a.7.7 0 001 .8z" />
        </svg>
      </button>
    </div>
  );
}
