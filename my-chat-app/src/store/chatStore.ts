import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Scenario } from '@/types/scenario';
import type { ChatMessage, Evaluation, SessionStatus } from '@/types/chat';
import { formatTime } from '@/lib/format';
import { evaluateSession, requestHint, sendTurn } from '@/api/chat';

interface ChatState {
  scenarioId: string | null;
  messages: ChatMessage[];
  friction: number;
  turnsUsed: number;
  penalties: number;
  delta: number | null;
  /** bumps on every score change so the delta pill re-animates */
  deltaKey: number;
  status: SessionStatus;
  typing: boolean;
  hint: string | null;
  hintLoading: boolean;
  error: string | null;
  voiceOn: boolean;
  /** id of the last character message handled by TTS, so a refresh doesn't re-read it */
  spokenId: string | null;
  evaluation: Evaluation | null;
  evaluating: boolean;

  start: (sc: Scenario) => void;
  send: (sc: Scenario, text: string) => Promise<boolean>;
  getHint: (sc: Scenario) => Promise<void>;
  closeHint: () => void;
  toggleVoice: () => void;
  markSpoken: (id: string) => void;
  evaluate: (sc: Scenario) => Promise<void>;
  clearError: () => void;
}

const uid = () => Math.random().toString(36).slice(2, 10);
const history = (m: ChatMessage[]) => m.map(({ sender, text }) => ({ sender, text }));

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      scenarioId: null,
      messages: [],
      friction: 0,
      turnsUsed: 0,
      penalties: 0,
      delta: null,
      deltaKey: 0,
      status: 'live',
      typing: false,
      hint: null,
      hintLoading: false,
      error: null,
      voiceOn: true,
      spokenId: null,
      evaluation: null,
      evaluating: false,

      start: (sc) =>
        set({
          scenarioId: sc.id,
          messages: [{ id: uid(), sender: 'character', text: sc.openingLine, time: formatTime() }],
          friction: sc.metric.start,
          turnsUsed: 0,
          penalties: 0,
          delta: null,
          status: 'live',
          typing: false,
          hint: null,
          error: null,
          evaluation: null,
        }),

      send: async (sc, raw) => {
        const text = raw.trim();
        const s = get();
        if (!text || s.typing || s.status !== 'live') return false;

        const userMsg: ChatMessage = { id: uid(), sender: 'user', text, time: formatTime() };
        set({ messages: [...s.messages, userMsg], typing: true, hint: null, error: null });

        try {
          const r = await sendTurn({
            scenarioId: sc.id,
            history: history(s.messages),
            friction: s.friction,
            turnsUsed: s.turnsUsed,
            text,
          });
          const penalty = r.trapId ? sc.traps.find((t) => t.id === r.trapId)?.penalty ?? 0 : 0;
          set((p) => ({
            messages: [
              ...p.messages.map((m) => (m.id === userMsg.id ? { ...m, feedback: r.feedback } : m)),
              { id: uid(), sender: 'character', text: r.reply, time: formatTime() },
            ],
            friction: r.friction,
            turnsUsed: p.turnsUsed + 1,
            penalties: p.penalties + penalty,
            delta: r.delta,
            deltaKey: p.deltaKey + 1,
            status: r.status,
            typing: false,
          }));
          return true;
        } catch (e) {
          // roll back the unsent message so the user can retry
          set((p) => ({
            messages: p.messages.filter((m) => m.id !== userMsg.id),
            typing: false,
            error: (e as Error).message || 'The character did not respond. Try again.',
          }));
          return false;
        }
      },

      getHint: async (sc) => {
        const s = get();
        if (s.hintLoading) return;
        set({ hintLoading: true, error: null });
        try {
          const hint = await requestHint({ scenarioId: sc.id, history: history(s.messages), friction: s.friction });
          set({ hint, hintLoading: false });
        } catch {
          set({ hintLoading: false, error: 'Hint unavailable right now.' });
        }
      },

      closeHint: () => set({ hint: null }),
      toggleVoice: () => set((p) => ({ voiceOn: !p.voiceOn })),
      markSpoken: (id) => set({ spokenId: id }),
      clearError: () => set({ error: null }),

      evaluate: async (sc) => {
        const s = get();
        if (s.evaluating) return;
        set({ evaluating: true, error: null });
        try {
          const evaluation = await evaluateSession({
            scenarioId: sc.id,
            history: s.messages,
            friction: s.friction,
            turnsUsed: s.turnsUsed,
            penalties: s.penalties,
          });
          set({ evaluation, evaluating: false });
        } catch (e) {
          set({ evaluating: false, error: (e as Error).message || 'Grading failed.' });
        }
      },
    }),
    {
      name: 'claritas-chat',
      // survives a page refresh, cleared when the tab closes
      storage: createJSONStorage(() => sessionStorage),
      partialize: (s) => ({
        scenarioId: s.scenarioId,
        messages: s.messages,
        friction: s.friction,
        turnsUsed: s.turnsUsed,
        penalties: s.penalties,
        status: s.status,
        voiceOn: s.voiceOn,
        spokenId: s.spokenId,
        evaluation: s.evaluation,
      }),
    },
  ),
);
