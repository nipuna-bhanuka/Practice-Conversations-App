export function HintCard({ text, onClose }: { text: string; onClose: () => void }) {
  return (
    <div className="flex w-full animate-rise items-start gap-3 rounded-[14px] border border-warn-line bg-warn-soft px-3.5 py-3 shadow-[0_6px_16px_-8px_rgba(180,83,9,.3)]">
      <span className="text-lg leading-snug">💡</span>
      <div className="min-w-0 flex-1">
        <div className="mb-0.5 text-xs font-bold text-warn-ink">Coach tip</div>
        <div className="text-sm leading-normal text-pretty text-[#5A3A0B]">{text}</div>
      </div>
      <button onClick={onClose} aria-label="Close hint" className="h-7 w-7 shrink-0 rounded-lg text-lg leading-none text-warn-ink hover:bg-[#FDEBCB]">
        ×
      </button>
    </div>
  );
}
