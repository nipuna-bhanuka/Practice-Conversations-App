import { Link } from 'react-router-dom';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-page/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-[clamp(16px,4vw,40px)] py-3">
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-primary text-[17px] font-extrabold text-white">C</span>
          <span className="text-[19px] font-extrabold tracking-tight text-ink">Claritas</span>
        </Link>
      </div>
    </header>
  );
}
