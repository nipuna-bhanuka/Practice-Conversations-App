import { useEffect } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { AppHeader } from '@/components/ui/AppHeader';
import { ScoreBar } from '@/components/chat/ScoreBar';
import { useChatStore } from '@/store/chatStore';
import { useScenario } from '@/hooks/useScenarios';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import NotFound from './NotFound';

function barColor(score: number) {
  if (score >= 65) return 'bg-good';
  if (score >= 45) return 'bg-warn';
  return 'bg-bad';
}

export default function ResultsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: sc, loading } = useScenario(id);
  const chat = useChatStore();
  const { speak } = useSpeechSynthesis();

  const hasSession = chat.scenarioId === id && chat.turnsUsed > 0;

  useEffect(() => {
    if (sc && hasSession && !chat.evaluation && !chat.evaluating && !chat.error) void chat.evaluate(sc);
  }, [sc, hasSession, chat]);

  if (loading) return <div className="min-h-screen bg-page"><AppHeader /></div>;
  if (!sc) return <NotFound />;
  if (!hasSession) return <Navigate to={`/scenarios/${sc.id}`} replace />;

  const ev = chat.evaluation;
  const userLines = chat.messages.filter((m) => m.sender === 'user' && m.feedback);
  const toImprove = userLines.filter((m) => m.feedback!.kind === 'trap' || m.feedback!.kind === 'neutral');
  const strong = userLines.filter((m) => m.feedback!.kind === 'strong' || m.feedback!.kind === 'good');

  const tryAgain = () => {
    chat.start(sc);
    navigate(`/scenarios/${sc.id}/chat`);
  };

  return (
    <div className="min-h-screen bg-page pb-16">
      <AppHeader />
      <div className="mx-auto flex max-w-[860px] flex-col gap-5 px-[clamp(16px,4vw,40px)] pt-8">
        <div className="text-sm font-semibold text-muted">
          Results · {sc.title}
        </div>

        {chat.evaluating || (!ev && !chat.error) ? (
          <div className="flex items-center gap-3 rounded-2xl border border-line bg-white p-8 text-muted">
            <span className="inline-flex gap-1">
              {[0, 0.15, 0.3].map((d) => (
                <span key={d} className="inline-block h-2 w-2 animate-typing rounded-full bg-primary" style={{ animationDelay: `${d}s` }} />
              ))}
            </span>
            Grading your conversation…
          </div>
        ) : !ev ? (
          <div className="rounded-2xl border border-bad-line bg-bad-soft p-6 text-bad-ink">
            {chat.error}
            <button onClick={() => chat.evaluate(sc)} className="ml-3 font-bold underline">
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* Outcome */}
            <div className="animate-rise rounded-2xl border border-line bg-white p-[clamp(20px,3vw,32px)] shadow-[0_1px_2px_rgba(16,24,40,.04)]">
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
                  ev.outcome === 'PASS' ? 'bg-good-soft text-good-ink' : 'bg-bad-soft text-bad-ink'
                }`}
              >
                {ev.outcome === 'PASS' ? 'Passed' : 'Not yet'}
              </span>
              <h1 className="mt-3 mb-2 text-[clamp(28px,4vw,40px)] leading-tight font-extrabold tracking-[-0.03em]">{ev.gradeLabel}</h1>
              <p className="m-0 text-base leading-relaxed text-pretty text-body">{ev.summary}</p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-line">
              <ScoreBar
                label={`Final ${sc.metric.label}`}
                value={chat.friction}
                target={sc.metric.target}
                delta={null}
                deltaKey={0}
                turnsUsed={chat.turnsUsed}
                maxTurns={sc.maxTurns}
              />
            </div>

            {/* Metrics */}
            <div className="rounded-2xl border border-line bg-white p-[clamp(20px,3vw,28px)]">
              <h2 className="mt-0 mb-4 text-lg font-bold">How you scored</h2>
              <div className="flex flex-col gap-4">
                {ev.metrics.map((m) => (
                  <div key={m.key}>
                    <div className="flex items-baseline justify-between">
                      <span className="text-[15px] font-semibold">{m.label}</span>
                      <span className="text-sm font-bold tabular-nums">{m.score}</span>
                    </div>
                    <div className="mt-1.5 h-2 rounded-full bg-line-soft">
                      <div className={`h-full rounded-full transition-[width] duration-700 ${barColor(m.score)}`} style={{ width: `${m.score}%` }} />
                    </div>
                    <div className="mt-1.5 text-[13px] leading-snug text-muted">{m.note}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lines to improve */}
            {toImprove.length > 0 && (
              <div className="rounded-2xl border border-line bg-white p-[clamp(20px,3vw,28px)]">
                <h2 className="mt-0 mb-1 text-lg font-bold">Lines to improve</h2>
                <p className="mt-0 mb-4 text-sm text-muted">Read the upgrade aloud before you try again.</p>
                <div className="flex flex-col gap-3">
                  {toImprove.map((m) => (
                    <div key={m.id} className="rounded-xl border border-[#F7D6D6] bg-[#FEF3F3] p-4">
                      <div className="text-xs font-bold text-bad-ink">{m.feedback!.label}</div>
                      <div className="mt-1 text-[15px] leading-normal text-ink">“{m.text}”</div>
                      <div className="mt-2 text-[13px] text-muted">{m.feedback!.note}</div>
                      {m.feedback!.upgrade && (
                        <div className="mt-3 border-t border-dashed border-[#F0CFCF] pt-3">
                          <div className="text-xs font-bold text-good-ink">Say this instead</div>
                          <div className="mt-1 text-[15px] leading-normal text-[#14532D]">“{m.feedback!.upgrade}”</div>
                          <button
                            onClick={() => speak(m.feedback!.upgrade!)}
                            className="mt-2 h-8 rounded-full border border-line bg-white px-3 text-xs font-bold text-body hover:border-ink"
                          >
                            ▶ Hear it
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {strong.length > 0 && (
              <div className="rounded-2xl border border-line bg-white p-[clamp(20px,3vw,28px)]">
                <h2 className="mt-0 mb-4 text-lg font-bold">What worked</h2>
                <div className="flex flex-col gap-3">
                  {strong.map((m) => (
                    <div key={m.id} className="rounded-xl border border-[#D5EFDD] bg-[#F0FAF3] p-4">
                      <div className="text-xs font-bold text-good-ink">{m.feedback!.label}</div>
                      <div className="mt-1 text-[15px] leading-normal text-ink">“{m.text}”</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <button onClick={tryAgain} className="h-12 rounded-xl bg-primary px-6 text-[15px] font-bold text-white hover:bg-primary-hover">
                Try again
              </button>
              <Link to="/" className="flex h-12 items-center rounded-xl border border-line bg-white px-6 text-[15px] font-bold text-ink no-underline hover:border-ink">
                All scenarios
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
