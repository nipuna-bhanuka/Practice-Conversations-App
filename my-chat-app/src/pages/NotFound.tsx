import { Link } from 'react-router-dom';
import { AppHeader } from '@/components/ui/AppHeader';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-page">
      <AppHeader />
      <div className="mx-auto max-w-[600px] px-4 py-24 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">Scenario not found</h1>
        <p className="text-muted">It may have been moved or renamed.</p>
        <Link to="/" className="mt-4 inline-block rounded-xl bg-primary px-5 py-3 font-bold text-white no-underline hover:bg-primary-hover">
          Back to scenarios
        </Link>
      </div>
    </div>
  );
}
