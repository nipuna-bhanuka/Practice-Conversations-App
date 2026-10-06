import { Router } from 'express';
import { HttpError } from '../lib/httpError.js';
import { getScenario, listScenarios } from '../services/scenarioStore.js';

export const scenariosRouter = Router();

scenariosRouter.get('/', (_req, res) => {
  res.json(listScenarios());
});

scenariosRouter.get('/:id', (req, res) => {
  const scenario = getScenario(req.params.id);
  if (!scenario) throw new HttpError(404, `Unknown scenario: ${req.params.id}`);
  res.json(scenario);
});
