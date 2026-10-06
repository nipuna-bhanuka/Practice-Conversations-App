/**
 * MOCK ONLY — imitates the future backend so the UI can be built and tested offline.
 * Same inputs/outputs as POST /api/chat/turn | /hint | /evaluate.
 */
import { SCENARIOS } from '@/mock/scenarios';
import type { Scenario } from '@/types/scenario';
import type {
  EvaluateRequest,
  Evaluation,
  Feedback,
  HintRequest,
  TurnRequest,
  TurnResult,
} from '@/types/chat';
import { MOCK_SCRIPTS, type MockScript } from './mockScripts';

const NOTES = {
  strong: 'Precise, verifiable and in business terms — something they can repeat upstairs.',
  good: 'Right direction. Add the specific control, number or owner to make it land.',
  neutral: 'Nothing wrong, but nothing concrete to hold on to. Name a specific control or commitment.',
  trap: 'This phrasing works against you in this room. See the suggested upgrade.',
};

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function load(id: string): { sc: Scenario; script: MockScript } {
  const sc = SCENARIOS.find((s) => s.id === id);
  const script = MOCK_SCRIPTS[id];
  if (!sc || !script) throw new Error(`Unknown scenario: ${id}`);
  return { sc, script };
}

interface Scored {
  delta: number;
  trapId: string | null;
  feedback: Feedback;
}

function score(text: string, sc: Scenario, script: MockScript): Scored {
  const t = ' ' + text.toLowerCase().trim() + ' ';
  for (const trap of sc.traps) {
    const re = script.trapPatterns[trap.id];
    if (re && re.test(t.trim())) {
      return {
        delta: trap.penalty,
        trapId: trap.id,
        feedback: { kind: 'trap', label: `${trap.chipLabel} +${trap.penalty}`, note: NOTES.trap, upgrade: script.upgrades[trap.id] },
      };
    }
  }
  const hits = script.strong.filter((w) => t.includes(w)).length;
  const words = text.trim().split(/\s+/).length;
  if (hits >= 2 && words >= 12) return { delta: -20, trapId: null, feedback: { kind: 'strong', label: 'Strong −20', note: NOTES.strong } };
  if (hits >= 1 && words >= 7) return { delta: -10, trapId: null, feedback: { kind: 'good', label: 'Good −10', note: NOTES.good } };
  return { delta: 0, trapId: null, feedback: { kind: 'neutral', label: 'Neutral', note: NOTES.neutral } };
}

/** how many earlier answers moved the conversation forward */
function stageOf(history: TurnRequest['history'], sc: Scenario, script: MockScript) {
  return history.filter((m) => m.sender === 'user' && score(m.text, sc, script).delta < 0).length;
}

export async function mockTurn(req: TurnRequest): Promise<TurnResult> {
  const { sc, script } = load(req.scenarioId);
  if (req.turnsUsed >= sc.maxTurns) throw new Error('No turns left in this session.');
  await wait(1200 + Math.random() * 800);

  const r = score(req.text, sc, script);
  const friction = clamp(req.friction + r.delta, 0, 100);
  const turnsUsed = req.turnsUsed + 1;
  const stage = stageOf(req.history, sc, script);

  let status: TurnResult['status'] = 'live';
  let reply: string;
  if (friction <= sc.metric.target) {
    reply = script.closing;
    status = 'success';
  } else if (r.trapId) {
    reply = script.pushback[r.trapId] ?? script.neutral;
  } else if (r.feedback.kind === 'neutral') {
    reply = script.neutral;
  } else {
    reply = script.questions[stage] ?? 'Go on. What else should I know before I take this upstairs?';
  }
  if (status !== 'success' && turnsUsed >= sc.maxTurns) {
    status = 'out';
    reply = script.outLine;
  }

  return { reply, delta: r.delta, friction, feedback: r.feedback, trapId: r.trapId, status };
}

export async function mockHint(req: HintRequest): Promise<string> {
  const { sc, script } = load(req.scenarioId);
  await wait(600);
  const stage = stageOf(req.history, sc, script);
  return script.hints[Math.min(stage, script.hints.length - 1)] ?? 'Be specific: name the control, the owner and what happens next.';
}

export async function mockEvaluate(req: EvaluateRequest): Promise<Evaluation> {
  const { sc } = load(req.scenarioId);
  await wait(1400);

  const user = req.history.filter((m) => m.sender === 'user');
  const count = (k: string) => user.filter((m) => m.feedback?.kind === k).length;
  const strong = count('strong'), good = count('good'), traps = count('trap'), neutral = count('neutral');
  const n = Math.max(user.length, 1);

  const reduction = sc.metric.start - req.friction;
  const needed = sc.metric.start - sc.metric.target;
  const progress = clamp(Math.round((reduction / needed) * 100), 0, 100);
  const quality = clamp(Math.round(((strong * 100 + good * 65 + neutral * 35) / n) - traps * 12), 0, 100);
  const passed = req.friction <= sc.metric.target;

  const metrics = [
    { key: 'problem_discovery', label: 'Problem discovery', score: clamp(Math.round(progress * 0.6 + quality * 0.4), 0, 100), note: progress >= 70 ? `You addressed what ${sc.character.name} was really worried about.` : `You didn’t fully get to what ${sc.character.name} was worried about.` },
    { key: 'clarity', label: 'Clarity', score: clamp(quality - traps * 5, 0, 100), note: traps ? `${traps} line${traps > 1 ? 's' : ''} fell into a trap — see the upgrades below.` : 'You avoided every trap in this scenario.' },
    { key: 'actionability', label: 'Actionability', score: clamp(Math.round(strong * 25 + good * 12), 0, 100), note: strong ? 'You named concrete controls, owners or dates.' : 'Add named owners, numbers and dates to your answers.' },
    { key: 'composure', label: 'Composure', score: clamp(85 - traps * 15 - neutral * 5, 0, 100), note: traps ? 'Pressure pushed you into defensive phrasing at least once.' : 'You stayed calm and professional under pressure.' },
  ];

  const best = user.find((m) => m.feedback?.kind === 'strong') ?? user.find((m) => m.feedback?.kind === 'good');
  const worst = user.find((m) => m.feedback?.kind === 'trap');

  return {
    outcome: passed ? 'PASS' : 'REFERRAL',
    gradeLabel: passed ? (traps ? 'Pass — with room to sharpen' : 'Pass — strong command') : progress >= 50 ? 'Referral — close, keep going' : 'Referral — try again',
    summary: [
      passed
        ? `You brought ${sc.metric.label.toLowerCase()} down to ${req.friction} in ${req.turnsUsed} turns.`
        : `${sc.metric.label} finished at ${req.friction}; the target was ${sc.metric.target} or below.`,
      best ? `Your strongest line: “${best.text.replace(/[.!?]+$/, '')}”.` : '',
      worst ? `The most costly: “${worst.text.replace(/[.!?]+$/, '')}”.` : '',
    ].filter(Boolean).join(' '),
    metrics,
  };
}
