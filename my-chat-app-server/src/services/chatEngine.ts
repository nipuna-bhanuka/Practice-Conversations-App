/**
 * Scripted chat engine — keyword scoring and canned replies from data/scripts.json.
 * Ported from the frontend's mock/mockEngine.ts; step 4 swaps the reply/feedback part for Gemini.
 */
import { HttpError } from '../lib/httpError.js';
import { getScenario } from './scenarioStore.js';
import { getScript, type Script } from './scriptStore.js';
import type { Scenario } from '../types/scenario.js';
import type {
  EvaluateRequest,
  Evaluation,
  Feedback,
  HintRequest,
  MetricScore,
  TurnRequest,
  TurnResult,
} from '../types/chat.js';

const NOTES = {
  strong: 'Precise, verifiable and in business terms — something they can repeat upstairs.',
  good: 'Right direction. Add the specific control, number or owner to make it land.',
  neutral: 'Nothing wrong, but nothing concrete to hold on to. Name a specific control or commitment.',
  trap: 'This phrasing works against you in this room. See the suggested upgrade.',
};

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

export function load(id: string): { sc: Scenario; script: Script } {
  const sc = getScenario(id);
  const script = getScript(id);
  if (!sc || !script) throw new HttpError(404, `Unknown scenario: ${id}`);
  return { sc, script };
}

export function assertTurnsLeft(req: TurnRequest, sc: Scenario) {
  if (req.turnsUsed >= sc.maxTurns) throw new HttpError(400, 'No turns left in this session.');
}

export interface Scored {
  delta: number;
  trapId: string | null;
  feedback: Feedback;
}

/** 'strong' | 'good' | 'neutral', or the id of the trap the message fell into */
export type Verdict = string;

/** The fixed scoring rules: turns a verdict into a friction change and feedback chip. */
export function scoreVerdict(verdict: Verdict, sc: Scenario, script: Script, note?: string, upgrade?: string): Scored {
  const trap = sc.traps.find((t) => t.id === verdict);
  if (trap) {
    return {
      delta: trap.penalty,
      trapId: trap.id,
      feedback: { kind: 'trap', label: `${trap.chipLabel} +${trap.penalty}`, note: note || NOTES.trap, upgrade: upgrade || script.upgrades[trap.id] },
    };
  }
  if (verdict === 'strong') return { delta: -20, trapId: null, feedback: { kind: 'strong', label: 'Strong −20', note: note || NOTES.strong } };
  if (verdict === 'good') return { delta: -10, trapId: null, feedback: { kind: 'good', label: 'Good −10', note: note || NOTES.good } };
  return { delta: 0, trapId: null, feedback: { kind: 'neutral', label: 'Neutral', note: note || NOTES.neutral } };
}

function score(text: string, sc: Scenario, script: Script): Scored {
  const t = ' ' + text.toLowerCase().trim() + ' ';
  const trap = sc.traps.find((trap) => script.trapPatterns[trap.id]?.test(t.trim()));
  if (trap) return scoreVerdict(trap.id, sc, script);
  const hits = script.strong.filter((w) => t.includes(w)).length;
  const words = text.trim().split(/\s+/).length;
  if (hits >= 2 && words >= 12) return scoreVerdict('strong', sc, script);
  if (hits >= 1 && words >= 7) return scoreVerdict('good', sc, script);
  return scoreVerdict('neutral', sc, script);
}

/** how many earlier answers moved the conversation forward */
function stageOf(history: TurnRequest['history'], sc: Scenario, script: Script) {
  return history.filter((m) => m.sender === 'user' && score(m.text, sc, script).delta < 0).length;
}

export function takeTurn(req: TurnRequest): TurnResult {
  const { sc, script } = load(req.scenarioId);
  assertTurnsLeft(req, sc);

  const r = score(req.text, sc, script);
  let reply: string;
  if (r.trapId) {
    reply = script.pushback[r.trapId] ?? script.neutral;
  } else if (r.feedback.kind === 'neutral') {
    reply = script.neutral;
  } else {
    reply = script.questions[stageOf(req.history, sc, script)] ?? 'Go on. What else should I know before I take this upstairs?';
  }
  return finishTurn(req, sc, script, r, reply);
}

/** The fixed session rules: applies the friction change, and ends on the scripted closing/out line. */
export function finishTurn(req: TurnRequest, sc: Scenario, script: Script, r: Scored, liveReply: string): TurnResult {
  const friction = clamp(req.friction + r.delta, 0, 100);
  const turnsUsed = req.turnsUsed + 1;

  let status: TurnResult['status'] = 'live';
  let reply = liveReply;
  if (friction <= sc.metric.target) {
    status = 'success';
    reply = script.closing;
  } else if (turnsUsed >= sc.maxTurns) {
    status = 'out';
    reply = script.outLine;
  }
  return { reply, delta: r.delta, friction, feedback: r.feedback, trapId: r.trapId, status };
}

export function getHint(req: HintRequest): string {
  const { sc, script } = load(req.scenarioId);
  const stage = stageOf(req.history, sc, script);
  return script.hints[Math.min(stage, script.hints.length - 1)] ?? 'Be specific: name the control, the owner and what happens next.';
}

export function evaluate(req: EvaluateRequest): Evaluation {
  const { sc } = load(req.scenarioId);

  const user = req.history.filter((m) => m.sender === 'user');
  const count = (k: string) => user.filter((m) => m.feedback?.kind === k).length;
  const strong = count('strong'), good = count('good'), traps = count('trap'), neutral = count('neutral');
  const n = Math.max(user.length, 1);

  const reduction = sc.metric.start - req.friction;
  const needed = Math.max(sc.metric.start - sc.metric.target, 1);
  const progress = clamp(Math.round((reduction / needed) * 100), 0, 100);
  const quality = clamp(Math.round(((strong * 100 + good * 65 + neutral * 35) / n) - traps * 12), 0, 100);
  const passed = req.friction <= sc.metric.target;

  const metrics: MetricScore[] = [
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
