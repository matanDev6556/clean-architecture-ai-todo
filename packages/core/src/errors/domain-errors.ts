// Custom domain errors
export class DomainError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 400
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends DomainError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class ValidationError extends DomainError {
  constructor(
    message: string,
    public readonly details?: any
  ) {
    super(message, 400);
  }
}

export class ServiceUnavailableError extends DomainError {
  constructor(message: string) {
    super(message, 503);
  }
}
