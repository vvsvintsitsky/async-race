import { CustomError } from "../error/CustomError";

export class HttpRequestError extends CustomError {
  constructor(
    message: string,
    public statusCode: number,
    public responseBody?: unknown
  ) {
    super(message);
  }
}
