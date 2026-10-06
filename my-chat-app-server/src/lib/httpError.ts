/** Throw from any route/service to send `{ error: message }` with the given status. */
export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}
