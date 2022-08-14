export class BffError extends Error {
    public extensions: Record<string, any>;

    constructor(message: string, code: string = 'INTERNAL_FAILED', extensions?: Record<string, any>) {
        super(message);

        // if no name provided, use the default. defineProperty ensures that it stays non-enumerable
        if (!this.name) {
            Object.defineProperty(this, 'name', { value: 'BffError' });
        }

        this.extensions = { ...extensions, code };
    }

}

export class ValidationError extends BffError {
    constructor(message: string) {
        super(message, 'VALIDATION_FAILED');

        Object.defineProperty(this, 'name', { value: 'ValidationError' });
    }
}

export class AuthenticationError extends BffError {
    constructor(message: string, extensions?: Record<string, any>) {
        super(message, 'UNAUTHENTICATED', extensions);

        Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
    }
}

export class ForbiddenError extends BffError {
    constructor(message: string, extensions?: Record<string, any>) {
        super(message, 'FORBIDDEN', extensions);

        Object.defineProperty(this, 'name', { value: 'ForbiddenError' });
    }
}