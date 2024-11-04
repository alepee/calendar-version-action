import * as core from '@actions/core'
import * as exec from '@actions/exec'
import type { GitManager } from '../gitManager.js'

export class VersionLock {
    private gitManager: GitManager

    constructor(gitManager: GitManager) {
        this.gitManager = gitManager
    }

    async acquireLock(version: string, maxRetries = 3, delay = 1000): Promise<boolean> {
        for (let i = 0; i < maxRetries; i++) {
            try {
                await exec.exec('git', ['fetch', '--tags', '--force'])

                const tags = await this.gitManager.getTags()
                if (!tags.includes(version)) {
                    return true
                }

                if (i < maxRetries - 1) {
                    await new Promise(resolve => setTimeout(resolve, delay))
                }
            } catch (error) {
                core.warning(`Lock acquisition attempt ${i + 1} failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
            }
        }

        return false
    }
} 
