import { api, USE_MOCK } from '@/api/client';
import { SCENARIOS } from '@/mock/scenarios';
import type { Scenario } from '@/types/scenario';

export async function fetchScenarios(): Promise<Scenario[]> {
  if (USE_MOCK) return SCENARIOS;
  return api.get<Scenario[]>('/scenarios');
}

export async function fetchScenario(id: string): Promise<Scenario | null> {
  if (USE_MOCK) return SCENARIOS.find((s) => s.id === id) ?? null;
  return api.get<Scenario>(`/scenarios/${id}`);
}
