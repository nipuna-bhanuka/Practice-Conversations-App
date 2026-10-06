export type Sender = 'character' | 'user';

export type FeedbackKind = 'strong' | 'good' | 'neutral' | 'trap';

export interface Feedback {
  kind: FeedbackKind;
  label: string;
  note: string;
  upgrade?: string;
}

export interface ChatMessage {
  id: string;
  sender: Sender;
  text: string;
  time: string;
  feedback?: Feedback;
}

export type SessionStatus = 'live' | 'success' | 'out';

export interface TurnRequest {
  scenarioId: string;
  history: Pick<ChatMessage, 'sender' | 'text'>[];
  friction: number;
  turnsUsed: number;
  text: string;
}

export interface TurnResult {
  reply: string;
  delta: number;
  friction: number;
  feedback: Feedback;
  trapId: string | null;
  status: SessionStatus;
}

export interface HintRequest {
  scenarioId: string;
  history: Pick<ChatMessage, 'sender' | 'text'>[];
  friction: number;
}

export interface EvaluateRequest {
  scenarioId: string;
  history: ChatMessage[];
  friction: number;
  turnsUsed: number;
  penalties: number;
}

export interface MetricScore {
  key: string;
  label: string;
  score: number;
  note: string;
}

export interface Evaluation {
  outcome: 'PASS' | 'REFERRAL';
  gradeLabel: string;
  summary: string;
  metrics: MetricScore[];
}
