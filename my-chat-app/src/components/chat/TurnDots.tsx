export function TurnDots({ used, total }: { used: number; total: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${used} of ${total} turns used`}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`h-[9px] w-[9px] rounded-full border-[1.5px] transition-colors duration-300 ${
            i < used ? 'border-primary bg-primary' : 'border-[#C9CEDA] bg-transparent'
          }`}
        />
      ))}
    </div>
  );
}
