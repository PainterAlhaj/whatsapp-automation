import { ApiErrorResponse } from "./types";

/**
 * Base custom error class for API interaction errors.
 */
export class ApiError extends Error {
  public readonly status: number;
  public readonly code?: string;
  public readonly details?: Record<string, string[] | string>;

  constructor(message: string, status: number, code?: string, details?: Record<string, string[] | string>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string, code?: string, details?: Record<string, string[] | string>) {
    super(message, 400, code, details);
    this.name = "BadRequestError";
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized access, please log in.") {
    super(message, 401, "UNAUTHORIZED");
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = "You do not have permission to perform this action.") {
    super(message, 403, "FORBIDDEN");
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "Requested resource not found.") {
    super(message, 404, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, details?: Record<string, string[] | string>) {
    super(message, 422, "VALIDATION_FAILED", details);
    this.name = "ValidationError";
  }
}

export class InternalServerError extends ApiError {
  constructor(message = "An unexpected server error occurred.") {
    super(message, 500, "INTERNAL_SERVER_ERROR");
    this.name = "InternalServerError";
  }
}

/**
 * Resolves appropriate subclass of ApiError depending on HTTP response status code and JSON error payload.
 */
export async function parseErrorResponse(response: Response): Promise<ApiError> {
  const status = response.status;
  let message = `API request failed with status code ${status}`;
  let code: string | undefined;
  let details: Record<string, string[] | string> | undefined;

  try {
    const body: ApiErrorResponse = await response.json();
    if (body?.error) {
      message = body.error.message;
      code = body.error.code;
      details = body.error.details;
    }
  } catch {
    // If response body does not contain valid JSON error envelope, fallback to status descriptions
  }

  switch (status) {
    case 400:
      return new BadRequestError(message, code, details);
    case 401:
      return new UnauthorizedError(message);
    case 403:
      return new ForbiddenError(message);
    case 404:
      return new NotFoundError(message);
    case 422:
      return new ValidationError(message, details);
    case 500:
    default:
      return new InternalServerError(message);
  }
}
