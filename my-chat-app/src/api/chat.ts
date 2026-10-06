import { api, USE_MOCK } from '@/api/client';
import type { EvaluateRequest, Evaluation, HintRequest, TurnRequest, TurnResult } from '@/types/chat';
import { mockEvaluate, mockHint, mockTurn } from '@/mock/mockEngine';

export function sendTurn(req: TurnRequest): Promise<TurnResult> {
  return USE_MOCK ? mockTurn(req) : api.post<TurnResult>('/chat/turn', req);
}

export async function requestHint(req: HintRequest): Promise<string> {
  if (USE_MOCK) return mockHint(req);
  const { hint } = await api.post<{ hint: string }>('/chat/hint', req);
  return hint;
}

export function evaluateSession(req: EvaluateRequest): Promise<Evaluation> {
  return USE_MOCK ? mockEvaluate(req) : api.post<Evaluation>('/chat/evaluate', req);
}
