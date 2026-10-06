import { readFile } from 'node:fs/promises';
import { z } from 'zod';
import type { Scenario } from '../types/scenario.js';

const DATA_FILE = new URL('../../data/scenarios.json', import.meta.url);

/** Mirrors types/scenario.ts — annotated with Scenario so the two can't drift apart. */
const scenarioSchema: z.ZodType<Scenario> = z.object({
  id: z.string().min(1),
  category: z.string(),
  type: z.string(),
  title: z.string(),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  description: z.string(),
  personality: z.string(),
  situation: z.string(),
  goal: z.string(),
  character: z.object({
    name: z.string(),
    role: z.string(),
    org: z.string(),
    initials: z.string(),
    color: z.string(),
    pronoun: z.enum(['she', 'he']),
  }),
  metric: z.object({ label: z.string(), start: z.number(), target: z.number() }),
  maxTurns: z.number().int().positive(),
  openingLine: z.string(),
  dos: z.array(z.object({ topic: z.string(), dont: z.string(), do: z.string(), why: z.string() })),
  traps: z.array(
    z.object({ id: z.string(), name: z.string(), chipLabel: z.string(), penalty: z.number(), description: z.string() }),
  ),
  reference: z.object({
    type: z.literal('workflow'),
    title: z.string(),
    nodes: z.array(z.object({ tag: z.enum(['MANUAL', 'AGENTIC', 'GATE']), label: z.string() })),
  }),
});

let scenarios: Scenario[] = [];

/** Reads and validates data/scenarios.json. Call once at startup; throws if the file is invalid. */
export async function loadScenarios(): Promise<void> {
  const raw = JSON.parse(await readFile(DATA_FILE, 'utf8'));
  const result = z.array(scenarioSchema).safeParse(raw);
  if (!result.success) {
    throw new Error(`Invalid data/scenarios.json:\n${z.prettifyError(result.error)}`);
  }
  const ids = result.data.map((s) => s.id);
  const dup = ids.find((id, i) => ids.indexOf(id) !== i);
  if (dup) throw new Error(`Duplicate scenario id in data/scenarios.json: ${dup}`);
  scenarios = result.data;
}

export function listScenarios(): Scenario[] {
  return scenarios;
}

export function getScenario(id: string): Scenario | undefined {
  return scenarios.find((s) => s.id === id);
}
