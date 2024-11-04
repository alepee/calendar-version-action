import type { Context } from '@actions/github/lib/context.d.ts'
import type { Octokit, ReleaseType } from './types.ts'
import { GitExecutor } from './utils/gitExecutor.js'
import { GitError } from './errors/index.js'

export class GitManager {
    async getTags(): Promise<string[]> {
        try {
            const output = await GitExecutor.execute(['tag'])
            return output.split('\n').filter(Boolean)
        } catch (error) {
            if (error instanceof GitError) {
                throw error
            }
            throw new GitError('Failed to fetch git tags')
        }
    }

    async createTag(version: string): Promise<void> {
        try {
            await GitExecutor.execute(['tag', version])
            await GitExecutor.execute(['push', 'origin', version])
        } catch (error) {
            if (error instanceof GitError) {
                throw error
            }
            throw new GitError(`Failed to create tag ${version}`)
        }
    }

    async createRelease(
        version: string,
        releaseType: ReleaseType,
        octokit: Octokit,
        context: Context
    ): Promise<void> {
        if (!releaseType) return

        try {
            await octokit.rest.repos.createRelease({
                ...context.repo,
                tag_name: version,
                name: version,
                prerelease: releaseType === 'pre',
                draft: false,
                generate_release_notes: true
            })
        } catch (error) {
            throw new GitError(
                `Failed to create release: ${error instanceof Error ? error.message : 'Unknown error'}`
            )
        }
    }
}
