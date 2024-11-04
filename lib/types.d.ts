import { Context } from '@actions/github/lib/context';
import { GitHub } from '@actions/github/lib/utils';
export type Octokit = InstanceType<typeof GitHub>;
export interface VersionContext {
    date: Date;
    tags: string[];
    cachedCount?: number;
}
export interface HookContext {
    version: string;
    context: Context;
    octokit?: Octokit;
}
export type ReleaseType = 'latest' | 'pre' | undefined;
export type HookCallback = (context: HookContext) => Promise<HookContext>;
