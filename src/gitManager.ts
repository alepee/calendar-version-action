import * as exec from '@actions/exec';
import { Octokit } from '@octokit/rest';
import { Context } from '@actions/github/lib/context';

class GitManager {
    async getTags(): Promise<string[]> {
        let output = '';
        await exec.exec('git', ['tag'], {
            listeners: {
                stdout: (data: Buffer) => {
                    output += data.toString();
                }
            }
        });
        return output.split('\n').filter(Boolean);
    }

    async createTag(version: string): Promise<void> {
        await exec.exec('git', ['tag', version]);
        await exec.exec('git', ['push', 'origin', version]);
    }

    async createRelease(
        version: string,
        releaseType: string | undefined,
        octokit: Octokit,
        context: Context
    ): Promise<void> {
        if (!releaseType) return;

        await octokit.rest.repos.createRelease({
            ...context.repo,
            tag_name: version,
            name: version,
            prerelease: releaseType === 'pre',
            draft: false,
            generate_release_notes: true
        });
    }
}

export { GitManager };
