import { Router } from 'express';
import { z } from 'zod';
import { parseBody } from '../lib/validate.js';
import { evaluate, getHint, takeTurn } from '../services/aiEngine.js';
import type { EvaluateRequest, HintRequest, TurnRequest } from '../types/chat.js';

const sender = z.enum(['character', 'user']);
const friction = z.number().min(0).max(100);
const turns = z.number().int().min(0);
const historyItem = z.object({ sender, text: z.string() });

const turnSchema: z.ZodType<TurnRequest> = z.object({
  scenarioId: z.string().min(1),
  history: z.array(historyItem),
  friction,
  turnsUsed: turns,
  text: z.string().trim().min(1, 'Message cannot be empty').max(2000),
});

const hintSchema: z.ZodType<HintRequest> = z.object({
  scenarioId: z.string().min(1),
  history: z.array(historyItem),
  friction,
});

const evaluateSchema: z.ZodType<EvaluateRequest> = z.object({
  scenarioId: z.string().min(1),
  history: z.array(
    z.object({
      id: z.string(),
      sender,
      text: z.string(),
      time: z.string(),
      feedback: z
        .object({
          kind: z.enum(['strong', 'good', 'neutral', 'trap']),
          label: z.string(),
          note: z.string(),
          upgrade: z.string().optional(),
        })
        .optional(),
    }),
  ),
  friction,
  turnsUsed: turns,
  penalties: z.number(),
});

export const chatRouter = Router();

chatRouter.post('/turn', async (req, res) => {
  res.json(await takeTurn(parseBody(turnSchema, req.body)));
});

chatRouter.post('/hint', async (req, res) => {
  res.json({ hint: await getHint(parseBody(hintSchema, req.body)) });
});

chatRouter.post('/evaluate', async (req, res) => {
  res.json(await evaluate(parseBody(evaluateSchema, req.body)));
});
