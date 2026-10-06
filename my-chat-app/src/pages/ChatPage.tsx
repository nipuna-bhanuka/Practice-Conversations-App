import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatInput } from '@/components/chat/ChatInput';
import { HintCard } from '@/components/chat/HintCard';
import { MessageList } from '@/components/chat/MessageList';
import { ResultBanner } from '@/components/chat/ResultBanner';
import { ScoreBar } from '@/components/chat/ScoreBar';
import { ScenarioSidePanel } from '@/components/chat/ScenarioSidePanel';
import { useChatStore } from '@/store/chatStore';
import { useScenario } from '@/hooks/useScenarios';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import NotFound from './NotFound';

export default function ChatPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: sc, loading } = useScenario(id);
  const chat = useChatStore();
  const [sheetOpen, setSheetOpen] = useState(false);
  const { speak, stop } = useSpeechSynthesis();

  // Opened by URL (not via "Start Chat")? Start a fresh session for this scenario.
  useEffect(() => {
    if (sc && (chat.scenarioId !== sc.id || chat.messages.length === 0)) chat.start(sc);
  }, [sc]);

  // Read each new character message aloud (including the opening line) exactly once.
  // spokenId is persisted, so messages restored after a refresh are not re-read.
  useEffect(() => {
    const last = [...chat.messages].reverse().find((m) => m.sender === 'character');
    if (!last || last.id === chat.spokenId) return;
    // Deferred: StrictMode's dev remount runs speechSynthesis.cancel() and would swallow a synchronous speak.
    const t = setTimeout(() => {
      chat.markSpoken(last.id);
      if (chat.voiceOn) speak(last.text);
    }, 0);
    return () => clearTimeout(t);
  }, [chat.messages, chat.voiceOn, chat.spokenId, speak]);

  useEffect(() => {
    if (!chat.voiceOn) stop();
  }, [chat.voiceOn, stop]);

  if (loading) return <div className="h-dvh bg-white" />;
  if (!sc) return <NotFound />;

  const toBriefing = () => navigate(`/scenarios/${sc.id}`);
  const toResults = () => navigate(`/scenarios/${sc.id}/results`);
  const live = chat.status === 'live';

  return (
    <div className="flex h-dvh overflow-hidden bg-white">
      {/* Left: scenario info (desktop) */}
      <aside className="hidden w-[30%] max-w-[420px] min-w-[300px] shrink-0 overflow-y-auto border-r border-line bg-white md:block">
        <ScenarioSidePanel scenario={sc} onBack={toBriefing} />
      </aside>

      {/* Right: the chat */}
      <section className="flex min-w-0 flex-1 flex-col">
        <ChatHeader
          character={sc.character}
          typing={chat.typing}
          voiceOn={chat.voiceOn}
          onToggleVoice={chat.toggleVoice}
          onBack={toBriefing}
          onInfo={() => setSheetOpen(true)}
          onEnd={chat.turnsUsed > 0 ? toResults : toBriefing}
        />

        <ScoreBar
          label={sc.metric.label}
          value={chat.friction}
          target={sc.metric.target}
          delta={chat.delta}
          deltaKey={chat.deltaKey}
          turnsUsed={chat.turnsUsed}
          maxTurns={sc.maxTurns}
        />

        {!live && (
          <ResultBanner
            kind={chat.status === 'success' ? 'success' : 'out'}
            friction={chat.friction}
            target={sc.metric.target}
            turnsUsed={chat.turnsUsed}
            pronoun={sc.character.pronoun}
            onResults={toResults}
          />
        )}

        <MessageList messages={chat.messages} typing={chat.typing} />

        {live && (
          <div className="flex flex-col items-start gap-2 border-t border-line bg-composer px-[clamp(10px,2vw,20px)] pt-2.5">
            {chat.error && (
              <div role="alert" className="flex w-full items-center justify-between gap-3 rounded-xl border border-bad-line bg-bad-soft px-3.5 py-2 text-sm text-bad-ink">
                {chat.error}
                <button onClick={chat.clearError} aria-label="Dismiss" className="text-lg leading-none">×</button>
              </div>
            )}
            {chat.hint ? (
              <HintCard text={chat.hint} onClose={chat.closeHint} />
            ) : (
              <button
                onClick={() => chat.getHint(sc)}
                disabled={chat.hintLoading || chat.typing}
                className="h-8 rounded-full border border-warn-line bg-warn-soft px-3.5 text-[13px] font-bold text-warn-ink hover:bg-[#FDEBCB] disabled:opacity-60"
              >
                {chat.hintLoading ? '💡 Thinking…' : '💡 Get a hint'}
              </button>
            )}
          </div>
        )}

        <ChatInput
          onSend={(text) => chat.send(sc, text)}
          disabled={!live}
          busy={chat.typing}
          placeholder={live ? 'Type your reply…' : 'Session ended'}
        />
      </section>

      {/* Scenario info on mobile */}
      <BottomSheet open={sheetOpen} title="Scenario info" onClose={() => setSheetOpen(false)}>
        <ScenarioSidePanel scenario={sc} />
      </BottomSheet>
    </div>
  );
}
