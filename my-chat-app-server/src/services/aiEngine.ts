/**
 * Gemini-backed chat. Gemini judges messages and writes the words; chatEngine's fixed rules decide
 * friction, status and scores. Any Gemini failure falls back to the scripted engine for that request.
 */
import { z } from 'zod';
import * as scripted from './chatEngine.js';
import { generateJson, geminiEnabled, text } from './gemini.js';
import { evaluatePrompt, hintPrompt, turnPrompt } from './prompts.js';
import type { EvaluateRequest, Evaluation, HintRequest, TurnRequest, TurnResult } from '../types/chat.js';

function fallback(what: string, err: unknown) {
  console.warn(`[gemini] ${what} failed, using scripted engine: ${err instanceof Error ? err.message : err}`);
}

export async function takeTurn(req: TurnRequest): Promise<TurnResult> {
  if (!geminiEnabled()) return scripted.takeTurn(req);
  const { sc, script } = scripted.load(req.scenarioId);
  scripted.assertTurnsLeft(req, sc);

  const schema = z.object({
    verdict: z.enum(['strong', 'good', 'neutral', ...sc.traps.map((t) => t.id)]),
    note: z.string(),
    upgrade: z.string(),
    reply: text(),
  });
  try {
    const out = await generateJson({ ...turnPrompt(sc, script, req), schema });
    const r = scripted.scoreVerdict(out.verdict, sc, script, out.note.trim(), out.upgrade.trim());
    return scripted.finishTurn(req, sc, script, r, out.reply.trim());
  } catch (err) {
    fallback('turn', err);
    return scripted.takeTurn(req);
  }
}

export async function getHint(req: HintRequest): Promise<string> {
  if (!geminiEnabled()) return scripted.getHint(req);
  const { sc, script } = scripted.load(req.scenarioId);

  try {
    const out = await generateJson({ ...hintPrompt(sc, script, req.history), schema: z.object({ hint: text() }) });
    return out.hint.trim();
  } catch (err) {
    fallback('hint', err);
    return scripted.getHint(req);
  }
}

export async function evaluate(req: EvaluateRequest): Promise<Evaluation> {
  const scored = scripted.evaluate(req);
  if (!geminiEnabled()) return scored;
  const { sc, script } = scripted.load(req.scenarioId);

  const schema = z.object({
    summary: text(),
    notes: z.object(Object.fromEntries(scored.metrics.map((m) => [m.key, text()]))),
  });
  try {
    const out = await generateJson({
      ...evaluatePrompt(sc, script, req.history, scored, req.friction, req.turnsUsed),
      schema,
    });
    return {
      ...scored,
      summary: out.summary.trim(),
      metrics: scored.metrics.map((m) => ({ ...m, note: out.notes[m.key]?.trim() || m.note })),
    };
  } catch (err) {
    fallback('evaluate', err);
    return scored;
  }
}
