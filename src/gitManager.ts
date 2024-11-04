import * as exec from '@actions/exec';
import { Octokit } from '@octokit/rest';
import { Context } from '@actions/github/lib/context';

interface ReleaseOptions {
    prerelease?: boolean;
    draft?: boolean;
}

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
        releaseType: string,
        octokit: Octokit,
        context: Context,
        options: ReleaseOptions = {}
    ): Promise<void> {
        await octokit.rest.repos.createRelease({
            ...context.repo,
            tag_name: version,
            name: version,
            prerelease: releaseType === 'pre',
            draft: options.draft || false
        });
    }
}

export { GitManager };
