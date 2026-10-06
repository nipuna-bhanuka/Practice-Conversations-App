import { useEffect, type ReactNode } from 'react';

interface Props {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function BottomSheet({ open, title, onClose, children }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-50 bg-ink/45 md:hidden" />
      <div role="dialog" aria-label={title} className="fixed inset-x-0 bottom-0 z-[51] md:hidden max-h-[86vh] animate-rise overflow-y-auto rounded-t-[20px] bg-white shadow-[0_-12px_32px_rgba(16,24,40,.2)]">
        <div className="sticky top-0 z-10 flex flex-col items-center gap-1.5 border-b border-line-soft bg-white px-4 pt-2 pb-1">
          <span className="h-1 w-10 rounded bg-[#D5D9E4]" />
          <div className="flex w-full items-center justify-between pb-1.5">
            <span className="text-[15px] font-bold">{title}</span>
            <button onClick={onClose} aria-label="Close" className="h-[34px] w-[34px] rounded-full bg-[#F2F4F7] text-lg text-body">
              ×
            </button>
          </div>
        </div>
        {children}
      </div>
    </>
  );
}
