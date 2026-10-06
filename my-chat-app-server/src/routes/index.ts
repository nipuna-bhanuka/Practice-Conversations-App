import { Router } from 'express';
import { scenariosRouter } from './scenarios.js';
import { chatRouter } from './chat.js';

export const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

apiRouter.use('/scenarios', scenariosRouter);
apiRouter.use('/chat', chatRouter);
