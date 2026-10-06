import { z } from 'zod';
import { HttpError } from './httpError.js';

/** Parses a request body with a zod schema; throws a 400 HttpError listing what's wrong. */
export function parseBody<T>(schema: z.ZodType<T>, body: unknown): T {
  const result = schema.safeParse(body);
  if (!result.success) throw new HttpError(400, `Invalid request body:\n${z.prettifyError(result.error)}`);
  return result.data;
}
