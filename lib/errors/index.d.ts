export declare class BaseError extends Error {
    constructor(message: string);
}
export declare class ValidationError extends BaseError {
    constructor(message: string);
}
export declare class GitError extends BaseError {
    readonly command?: string | undefined;
    constructor(message: string, command?: string | undefined);
}
export declare class ConfigError extends BaseError {
    readonly configPath?: string | undefined;
    constructor(message: string, configPath?: string | undefined);
}
export declare class LockError extends BaseError {
    readonly version: string;
    constructor(message: string, version: string);
}
