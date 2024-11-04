export declare const SERVICE_TOKENS: {
    readonly GitManager: "GitManager";
    readonly VersionGenerator: "VersionGenerator";
    readonly ConfigLoader: "ConfigLoader";
    readonly HookSystem: "HookSystem";
    readonly VersionLock: "VersionLock";
    readonly Logger: "Logger";
};
export type ServiceToken = typeof SERVICE_TOKENS[keyof typeof SERVICE_TOKENS];
