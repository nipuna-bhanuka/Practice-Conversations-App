import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { config } from '../config.js';

const client = config.geminiApiKey ? new GoogleGenAI({ apiKey: config.geminiApiKey }) : null;

/** A string that must not be blank — checked by zod after the call, not sent to Gemini (minLength isn't supported there). */
export const text = () => z.string().refine((s) => s.trim() !== '', 'must not be empty');

export function geminiEnabled(): boolean {
  return client !== null;
}

interface JsonRequest<T> {
  system: string;
  prompt: string;
  schema: z.ZodType<T>;
  temperature?: number;
}

/**
 * Calls Gemini in JSON mode with the zod schema as the response schema, then validates the result.
 * Throws on timeout, API errors, or output that doesn't match the schema — callers fall back.
 */
export async function generateJson<T>({ system, prompt, schema, temperature = 0.4 }: JsonRequest<T>): Promise<T> {
  if (!client) throw new Error('Gemini is not configured');

  const { $schema: _, ...jsonSchema } = z.toJSONSchema(schema) as Record<string, unknown>;
  const res = await client.models.generateContent({
    model: config.geminiModel,
    contents: prompt,
    config: {
      systemInstruction: system,
      temperature,
      responseMimeType: 'application/json',
      responseJsonSchema: jsonSchema,
      abortSignal: AbortSignal.timeout(config.geminiTimeoutMs),
    },
  });

  const text = res.text;
  if (!text) throw new Error(`Gemini returned no text (finish reason: ${res.candidates?.[0]?.finishReason ?? 'unknown'})`);
  const result = schema.safeParse(JSON.parse(text));
  if (!result.success) throw new Error(`Gemini output didn't match the schema:\n${z.prettifyError(result.error)}`);
  return result.data;
}
