import * as core from '@actions/core';
import * as exec from '@actions/exec';

export class VersionLock {
    constructor(gitManager) {
        this.gitManager = gitManager;
    }

    async acquireLock(version, maxRetries = 3, delay = 1000) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                await exec.exec('git', ['fetch', '--tags', '--force']);

                const tags = await this.gitManager.getTags();
                if (!tags.includes(version)) {
                    return true;
                }

                if (i < maxRetries - 1) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            } catch (error) {
                core.warning(`Lock acquisition attempt ${i + 1} failed: ${error.message}`);
            }
        }

        return false;
    }
}
