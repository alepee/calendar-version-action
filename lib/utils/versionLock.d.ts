import type { GitManager } from '../gitManager.js';
export declare class VersionLock {
    private gitManager;
    constructor(gitManager: GitManager);
    acquireLock(version: string, maxRetries?: number, delay?: number): Promise<boolean>;
}
