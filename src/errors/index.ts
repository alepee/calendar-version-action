export class BaseError extends Error {
    constructor(message: string) {
        super(message)
        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor)
    }
}

export class ValidationError extends BaseError {
    constructor(message: string) {
        super(message)
    }
}

export class GitError extends BaseError {
    constructor(message: string, public readonly command?: string) {
        super(message)
    }
}

export class ConfigError extends BaseError {
    constructor(message: string, public readonly configPath?: string) {
        super(message)
    }
}

export class LockError extends BaseError {
    constructor(message: string, public readonly version: string) {
        super(message)
    }
} 
