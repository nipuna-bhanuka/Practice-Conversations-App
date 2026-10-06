import { Link, useNavigate, useParams } from 'react-router-dom';
import { AppHeader } from '@/components/ui/AppHeader';
import { CharacterProfile } from '@/components/briefing/CharacterProfile';
import { DoDontRow } from '@/components/briefing/DoDontRow';
import { HowItWorksCard, HowItWorksInline, StartChatBar } from '@/components/briefing/HowItWorksCard';
import { TrapCard } from '@/components/briefing/TrapCard';
import { useChatStore } from '@/store/chatStore';
import { useScenario } from '@/hooks/useScenarios';
import NotFound from './NotFound';

export default function ScenarioBriefingPage() {
  const { id } = useParams();
  const { data: sc, loading } = useScenario(id);
  const start = useChatStore((s) => s.start);
  const navigate = useNavigate();

  if (loading) return <div className="min-h-screen bg-page"><AppHeader /></div>;
  if (!sc) return <NotFound />;

  const startChat = () => {
    start(sc);
    navigate(`/scenarios/${sc.id}/chat`);
  };

  return (
    <div className="min-h-screen bg-page pb-[110px] md:pb-16">
      <AppHeader />
      <div className="mx-auto max-w-[1200px] px-[clamp(16px,4vw,40px)] pt-5">
        <Link to="/" className="inline-block py-1.5 text-sm font-semibold text-primary no-underline hover:text-primary-hover hover:underline">
          ← Back to scenarios
        </Link>

        <div className="mt-3.5 flex items-start gap-8">
          <main className="flex min-w-0 flex-1 flex-col gap-5">
            <CharacterProfile scenario={sc} />

            <div className="rounded-2xl border border-line bg-white p-[clamp(20px,3vw,28px)] shadow-[0_1px_2px_rgba(16,24,40,.04)]">
              <h2 className="mt-0 mb-2.5 text-lg font-bold">Your situation</h2>
              <p className="m-0 max-w-[720px] text-base leading-[1.65] text-pretty text-body">{sc.situation}</p>
            </div>

            <div className="flex items-start gap-4 rounded-2xl border border-primary-line bg-primary-soft p-[clamp(20px,3vw,26px)]">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3.5" /></svg>
              </span>
              <div className="min-w-0">
                <div className="mb-1 text-[13px] font-bold text-primary">Your goal</div>
                <div className="text-lg leading-normal font-semibold text-pretty text-primary-ink">{sc.goal}</div>
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-white px-[clamp(20px,3vw,28px)] pt-[clamp(20px,3vw,28px)] pb-2.5 shadow-[0_1px_2px_rgba(16,24,40,.04)]">
              <div className="mb-3.5 flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="m-0 text-lg font-bold">Do's and Don'ts</h2>
                <span className="text-[13px] text-subtle">Say what it does, not what it feels like</span>
              </div>
              {sc.dos.map((r) => (
                <DoDontRow key={r.topic} row={r} />
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="mt-2 mb-0 text-lg font-bold">Traps to avoid</h2>
              <div className="grid gap-3.5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,210px),1fr))]">
                {sc.traps.map((t) => (
                  <TrapCard key={t.id} trap={t} />
                ))}
              </div>
            </div>

            <div className="md:hidden">
              <HowItWorksInline scenario={sc} />
            </div>
          </main>

          <aside className="sticky top-[84px] hidden w-[360px] shrink-0 md:block">
            <HowItWorksCard scenario={sc} onStart={startChat} />
          </aside>
        </div>
      </div>

      <div className="md:hidden">
        <StartChatBar scenario={sc} onStart={startChat} />
      </div>
    </div>
  );
}
