export class BaseError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
export class ValidationError extends BaseError {
    constructor(message) {
        super(message);
    }
}
export class GitError extends BaseError {
    command;
    constructor(message, command) {
        super(message);
        this.command = command;
    }
}
export class ConfigError extends BaseError {
    configPath;
    constructor(message, configPath) {
        super(message);
        this.configPath = configPath;
    }
}
export class LockError extends BaseError {
    version;
    constructor(message, version) {
        super(message);
        this.version = version;
    }
}
