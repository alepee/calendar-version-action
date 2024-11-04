import { GitExecutor } from './utils/gitExecutor.js';
import { GitError } from './errors/index.js';
export class GitManager {
    async getTags() {
        try {
            const output = await GitExecutor.execute(['tag']);
            return output.split('\n').filter(Boolean);
        }
        catch (error) {
            if (error instanceof GitError) {
                throw error;
            }
            throw new GitError('Failed to fetch git tags');
        }
    }
    async createTag(version) {
        try {
            await GitExecutor.execute(['tag', version]);
            await GitExecutor.execute(['push', 'origin', version]);
        }
        catch (error) {
            if (error instanceof GitError) {
                throw error;
            }
            throw new GitError(`Failed to create tag ${version}`);
        }
    }
    async createRelease(version, releaseType, octokit, context) {
        if (!releaseType)
            return;
        try {
            await octokit.rest.repos.createRelease({
                ...context.repo,
                tag_name: version,
                name: version,
                prerelease: releaseType === 'pre',
                draft: false,
                generate_release_notes: true
            });
        }
        catch (error) {
            throw new GitError(`Failed to create release: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
