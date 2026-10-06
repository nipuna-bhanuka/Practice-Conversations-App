export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Character {
  name: string;
  role: string;
  org: string;
  initials: string;
  color: string;
  pronoun: 'she' | 'he';
}

export interface DoDont {
  topic: string;
  dont: string;
  do: string;
  why: string;
}

export interface Trap {
  id: string;
  name: string;
  chipLabel: string;
  penalty: number;
  description: string;
}

export type NodeTag = 'MANUAL' | 'AGENTIC' | 'GATE';

export interface ReferenceNode {
  tag: NodeTag;
  label: string;
}

export interface WorkflowReference {
  type: 'workflow';
  title: string;
  nodes: ReferenceNode[];
}

export type ScenarioReference = WorkflowReference;

export interface Scenario {
  id: string;
  category: string;
  type: string;
  title: string;
  difficulty: Difficulty;
  description: string;
  personality: string;
  situation: string;
  goal: string;
  character: Character;
  metric: {
    label: string;
    start: number;
    target: number;
  };
  maxTurns: number;
  openingLine: string;
  dos: DoDont[];
  traps: Trap[];
  reference: ScenarioReference;
}
