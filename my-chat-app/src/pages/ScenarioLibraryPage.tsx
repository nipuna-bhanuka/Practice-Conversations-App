import { useMemo, useState } from 'react';
import { AppHeader } from '@/components/ui/AppHeader';
import { CategoryFilter } from '@/components/scenarios/CategoryFilter';
import { ScenarioCard } from '@/components/scenarios/ScenarioCard';
import { useScenarios } from '@/hooks/useScenarios';

export default function ScenarioLibraryPage() {
  const { data: scenarios, loading, error } = useScenarios();
  const [filter, setFilter] = useState('All');

  const categories = useMemo(() => ['All', ...new Set(scenarios.map((s) => s.category))], [scenarios]);
  const list = filter === 'All' ? scenarios : scenarios.filter((s) => s.category === filter);

  return (
    <div className="min-h-screen bg-page pb-16">
      <AppHeader />

      <section className="mx-auto max-w-[1200px] px-[clamp(16px,4vw,40px)] pt-[clamp(36px,6vw,72px)] pb-7">
        <h1 className="m-0 max-w-[760px] text-[clamp(32px,4.6vw,52px)] leading-[1.08] font-extrabold tracking-[-0.035em] text-balance">
          Practise the conversations that matter
        </h1>
        <p className="mt-4 mb-0 max-w-[640px] text-[clamp(16px,1.6vw,19px)] leading-relaxed text-pretty text-muted">
          Face realistic workplace pressure. Get scored on every reply. Improve in 10 turns or less.
        </p>
      </section>

      <section className="mx-auto max-w-[1200px] px-[clamp(16px,4vw,40px)]">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <CategoryFilter options={categories} value={filter} onChange={setFilter} />
          <span className="text-sm text-subtle">
            {list.length} {list.length === 1 ? 'scenario' : 'scenarios'}
          </span>
        </div>

        {error && <p className="text-bad">{error}</p>}
        {loading ? (
          <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(min(100%,320px),1fr))]">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-[290px] animate-pulse rounded-2xl border border-line bg-white" />
            ))}
          </div>
        ) : (
          <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(min(100%,320px),1fr))]">
            {list.map((s) => (
              <ScenarioCard key={s.id} scenario={s} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
