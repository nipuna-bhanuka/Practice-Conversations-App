import { readFile } from 'node:fs/promises';
import { z } from 'zod';
import { listScenarios } from './scenarioStore.js';

const DATA_FILE = new URL('../../data/scripts.json', import.meta.url);

/** Scripted replies and keyword scoring for one scenario (used until Gemini takes over). */
export interface Script {
  /** follow-up questions asked after a good answer */
  questions: string[];
  /** one hint per question stage */
  hints: string[];
  closing: string;
  outLine: string;
  neutral: string;
  /** trap id → reply when that trap is hit */
  pushback: Record<string, string>;
  /** trap id → pattern that triggers it (stored as a string in scripts.json) */
  trapPatterns: Record<string, RegExp>;
  /** trap id → a better line to suggest when that trap is hit */
  upgrades: Record<string, string>;
  /** words that signal a concrete, useful answer */
  strong: string[];
}

const scriptSchema = z.object({
  questions: z.array(z.string()),
  hints: z.array(z.string()).min(1),
  closing: z.string(),
  outLine: z.string(),
  neutral: z.string(),
  pushback: z.record(z.string(), z.string()),
  trapPatterns: z.record(z.string(), z.string()),
  upgrades: z.record(z.string(), z.string()),
  strong: z.array(z.string()),
});

let scripts: Record<string, Script> = {};

/**
 * Reads and validates data/scripts.json. Call after loadScenarios(); throws if the file is invalid,
 * a pattern doesn't compile, or a scenario/trap has no script entry.
 */
export async function loadScripts(): Promise<void> {
  const raw = JSON.parse(await readFile(DATA_FILE, 'utf8'));
  const result = z.record(z.string(), scriptSchema).safeParse(raw);
  if (!result.success) {
    throw new Error(`Invalid data/scripts.json:\n${z.prettifyError(result.error)}`);
  }

  const loaded: Record<string, Script> = {};
  for (const sc of listScenarios()) {
    const s = result.data[sc.id];
    if (!s) throw new Error(`data/scripts.json has no entry for scenario "${sc.id}"`);

    const trapPatterns: Record<string, RegExp> = {};
    for (const trap of sc.traps) {
      const source = s.trapPatterns[trap.id];
      if (!source) throw new Error(`data/scripts.json: "${sc.id}" has no trapPattern for trap "${trap.id}"`);
      try {
        trapPatterns[trap.id] = new RegExp(source);
      } catch (err) {
        throw new Error(`data/scripts.json: "${sc.id}" trap "${trap.id}" has an invalid pattern: ${(err as Error).message}`);
      }
    }
    loaded[sc.id] = { ...s, trapPatterns };
  }
  scripts = loaded;
}

export function getScript(scenarioId: string): Script | undefined {
  return scripts[scenarioId];
}
