export const SERVICE_TOKENS = {
    GitManager: 'GitManager',
    VersionGenerator: 'VersionGenerator',
    ConfigLoader: 'ConfigLoader',
    HookSystem: 'HookSystem',
    VersionLock: 'VersionLock',
    Logger: 'Logger',
} as const

export type ServiceToken = typeof SERVICE_TOKENS[keyof typeof SERVICE_TOKENS] 
