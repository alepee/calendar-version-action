import type { Context } from '@actions/github/lib/context.d.ts';
import type { Octokit, ReleaseType } from './types.ts';
export declare class GitManager {
    getTags(): Promise<string[]>;
    createTag(version: string): Promise<void>;
    createRelease(version: string, releaseType: ReleaseType, octokit: Octokit, context: Context): Promise<void>;
}
