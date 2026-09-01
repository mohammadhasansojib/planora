export class AppError extends Error {
    public statusCode: number;
    public error: unknown;

    constructor(
        message: string = "Something went wrong!",
        statusCode: number = 500,
        error: unknown = {},
    ) {
        super(message);
        this.statusCode = statusCode;
        this.error = error;
    }
}

export class NotFoundError extends AppError {
    constructor(
        message: string = "Not Found",
        statusCode: number = 404,
        error: unknown = {},
    ) {
        super(message, statusCode, error);
    }
}

export class ForbiddenError extends AppError {
    constructor(
        message: string = "Forbidden",
        statusCode: number = 403,
        error: unknown = {},
    ) {
        super(message, statusCode, error);
    }
}

export class AuthorizationError extends AppError {
    constructor(
        message: string = "Unauthorized Access",
        statusCode: number = 401,
        error: unknown = {},
    ) {
        super(message, statusCode, error);
    }
}

export class BadRequestError extends AppError {
    constructor(
        message: string = "Bad request",
        statusCode: number = 400,
        error: unknown = {},
    ) {
        super(message, statusCode, error);
    }
}

export class ConflictError extends AppError {
    constructor(
        message: string = "Conflict error",
        statusCode: number = 409,
        error: unknown = {},
    ) {
        super(message, statusCode, error);
    }
}