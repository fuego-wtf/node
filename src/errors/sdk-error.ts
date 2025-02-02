export class GraphynError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode?: number,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'GraphynError';
  }

  static fromResponse(response: Response, details?: unknown): GraphynError {
    const statusCode = response.status;
    let code: string;
    let message: string;

    switch (statusCode) {
      case 400:
        code = 'BAD_REQUEST';
        message = 'Invalid request parameters';
        break;
      case 401:
        code = 'UNAUTHORIZED';
        message = 'Invalid or missing API key';
        break;
      case 403:
        code = 'FORBIDDEN';
        message = 'Access denied';
        break;
      case 404:
        code = 'NOT_FOUND';
        message = 'Resource not found';
        break;
      case 429:
        code = 'RATE_LIMIT_EXCEEDED';
        message = 'Too many requests';
        break;
      case 500:
        code = 'INTERNAL_SERVER_ERROR';
        message = 'Internal server error';
        break;
      default:
        code = 'UNKNOWN_ERROR';
        message = 'An unknown error occurred';
    }

    return new GraphynError(message, code, statusCode, details);
  }
}