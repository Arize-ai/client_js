import type { components } from "./__generated__/api/v2";

type Problem = components["schemas"]["Problem"];

/**
 * Thrown when the server rejects the request due to missing or invalid credentials (HTTP 401).
 */
export class AuthenticationError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(
      `Authentication failed (HTTP ${statusCode}): ${message}. Verify your API key is correct.`,
    );
    this.name = "AuthenticationError";
  }
}

/**
 * Thrown when the server rejects the request due to insufficient permissions (HTTP 403).
 */
export class AuthorizationError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(
      `Authorization failed (HTTP ${statusCode}): ${message}. Verify you have permission to perform this action.`,
    );
    this.name = "AuthorizationError";
  }
}

/**
 * Thrown when the server returns a non-2xx response.
 */
export class APIError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(`Request failed (HTTP ${statusCode}): ${message}`);
    this.name = "APIError";
  }
}

/**
 * Thrown when the server returns HTTP 400 (Bad Request).
 * Extends {@link APIError}.
 */
export class BadRequestError extends APIError {
  constructor(message: string) {
    super(400, message);
    this.name = "BadRequestError";
  }
}

/**
 * Thrown when the server returns HTTP 404 (Not Found).
 * Extends {@link APIError}.
 */
export class NotFoundError extends APIError {
  constructor(message: string) {
    super(404, message);
    this.name = "NotFoundError";
  }
}

/**
 * Handle API error responses from an openapi-fetch call.
 * Throws {@link AuthenticationError} for 401,
 * {@link AuthorizationError} for 403,
 * {@link BadRequestError} for 400,
 * {@link NotFoundError} for 404,
 * {@link APIError} for all other non-2xx responses.
 *
 * Useful for consistent fail-fast error handling across multiple API calls.
 */
export function handleApiError(response: { error: Problem }): never {
  const { error } = response;
  const status = error.status;
  const message = error.detail || error.title;

  if (status === 401) {
    throw new AuthenticationError(status, message);
  }
  if (status === 403) {
    throw new AuthorizationError(status, message);
  }
  if (status === 400) {
    throw new BadRequestError(message);
  }
  if (status === 404) {
    throw new NotFoundError(message);
  }
  throw new APIError(status, message);
}
