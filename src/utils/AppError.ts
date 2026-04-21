export class AppError extends Error {
    statusCode: number;
    isOperation: boolean;
    errorCode?: string;
    details?: string;

    constructor(
        message: string,
        statusCode: number = 500,
        errorCode?: string,
        details?: any,
    ) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.details = details;
        this.isOperation = true;

        Error.captureStackTrace(this, this.constructor);
    }
}