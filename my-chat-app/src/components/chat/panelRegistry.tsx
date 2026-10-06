import type { ScenarioReference } from '@/types/scenario';
import { WorkflowNodes } from './WorkflowNodes';

/**
 * Renders the scenario's reference material.
 * To add a new kind (e.g. a document or a chart): add a type in types/scenario.ts,
 * build the component, and add a case here.
 */
export function ReferencePanel({ reference }: { reference: ScenarioReference }) {
  switch (reference.type) {
    case 'workflow':
      return <WorkflowNodes reference={reference} />;
    default:
      return null;
  }
}
