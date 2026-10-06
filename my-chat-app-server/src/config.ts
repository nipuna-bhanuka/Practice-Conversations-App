import 'dotenv/config';

const port = Number(process.env.PORT ?? 3001);
if (!Number.isInteger(port) || port <= 0) throw new Error(`Invalid PORT: ${process.env.PORT}`);

const geminiApiKey = process.env.GEMINI_API_KEY?.trim() ?? '';
const geminiModel = process.env.GEMINI_MODEL?.trim() ?? '';
if (geminiApiKey && !geminiModel) {
  throw new Error('GEMINI_API_KEY is set but GEMINI_MODEL is empty — set GEMINI_MODEL in .env (a model name from Google AI Studio).');
}

export const config = {
  port,
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
  geminiApiKey,
  geminiModel,
  /** how long to wait for Gemini before falling back to the scripted engine */
  geminiTimeoutMs: Number(process.env.GEMINI_TIMEOUT_MS ?? 15000),
};
