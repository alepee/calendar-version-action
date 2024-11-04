import * as exec from '@actions/exec';

export class GitManager {
    async getTags() {
        let output = '';
        await exec.exec('git', ['tag'], {
            listeners: {
                stdout: (data) => {
                    output += data.toString();
                }
            }
        });
        return output.split('\n').filter(Boolean);
    }

    async createTag(version) {
        await exec.exec('git', ['tag', version]);
        await exec.exec('git', ['push', 'origin', version]);
    }

    async createRelease(version, releaseType, octokit, context) {
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
