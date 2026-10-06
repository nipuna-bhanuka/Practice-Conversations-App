export function TypingIndicator() {
  return (
    <div className="flex px-2" aria-label="typing">
      <div className="relative rounded-[0_12px_12px_12px] bg-white px-4 py-3 shadow-[0_1px_1.5px_rgba(16,24,40,.10)]">
        <span className="absolute top-0 -left-2 h-0 w-0 border-t-[10px] border-l-8 border-t-white border-l-transparent" />
        <span className="inline-flex h-3.5 items-center gap-1">
          {[0, 0.15, 0.3].map((d) => (
            <span key={d} className="inline-block h-[7px] w-[7px] animate-typing rounded-full bg-[#667085]" style={{ animationDelay: `${d}s` }} />
          ))}
        </span>
      </div>
    </div>
  );
}
