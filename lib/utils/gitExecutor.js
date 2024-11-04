import * as exec from '@actions/exec';
import { GitError } from '../errors/index.js';
export class GitExecutor {
    static async execute(command, options = {}) {
        let output = '';
        let errorOutput = '';
        try {
            const exitCode = await exec.exec('git', command, {
                silent: options.silent,
                cwd: options.cwd,
                listeners: {
                    stdout: (data) => {
                        output += data.toString();
                    },
                    stderr: (data) => {
                        errorOutput += data.toString();
                    }
                }
            });
            if (exitCode !== 0) {
                throw new GitError(`Git command failed with exit code ${exitCode}: ${errorOutput}`, `git ${command.join(' ')}`);
            }
            return output.trim();
        }
        catch (error) {
            if (error instanceof GitError) {
                throw error;
            }
            throw new GitError(`Failed to execute git command: ${error instanceof Error ? error.message : 'Unknown error'}`, `git ${command.join(' ')}`);
        }
    }
}
