import * as core from '@actions/core';
import * as github from '@actions/github';
import { GitManager } from './gitManager';
import { ConfigLoader } from './utils/configLoader';
import { hookNames, HookSystem } from './utils/hooks';
import { ActionLogger } from './utils/logger';
import { TagCache } from './utils/tagCache';
import { VersionLock } from './utils/versionLock';
import { validateInputs, ValidationError } from './validateInputs';
import { VersionGenerator } from './versionGenerator';

interface Config {
    format: string;
    dateFormat: string;
    shouldTag: boolean;
    releaseType?: string;
    tag?: string;
    release?: string;
}

interface VersionContext {
    date: Date;
    tags: string[];
    cachedCount: number;
    version?: string;
    releaseType?: string;
}

async function loadConfig(): Promise<Config> {
    const fileConfig = await ConfigLoader.loadConfig();
    
    return {
        format: core.getInput('format') || fileConfig.format || '%NOW%-%COUNT%',
        dateFormat: core.getInput('dateFormat') || fileConfig.dateFormat || 'yyyy.MM.dd',
        shouldTag: (core.getInput('tag') || fileConfig.tag || 'false').toLowerCase() === 'true',
        releaseType: core.getInput('release') || fileConfig.release,
    };
}

async function prepareVersionContext(
    tagCache: TagCache,
    generator: VersionGenerator,
    now: Date
): Promise<{ tags: string[]; cachedCount: number }> {
    const tags: string[] = [];
    let cachedCount = tagCache.get(generator.format, now);

    if (cachedCount === undefined) {
        ActionLogger.debug('Cache miss, fetching tags from Git');
        const gitManager = new GitManager();
        const fetchedTags = await gitManager.getTags();
        ActionLogger.debug('Existing tags', fetchedTags);

        cachedCount = generator.findHighestCount(fetchedTags, generator.generatePattern(now));
        tagCache.set(generator.format, now, cachedCount);
        return { tags: fetchedTags, cachedCount };
    }

    ActionLogger.debug('Using cached count', { cachedCount });
    return { tags, cachedCount };
}

async function handleTagging(
    hooks: HookSystem,
    gitManager: GitManager,
    tagCache: TagCache,
    version: string,
    context: { date: Date; cachedCount: number }
): Promise<void> {
    await hooks.trigger(hookNames.PRE_TAG, { version });
    await gitManager.createTag(version);

    tagCache.set(gitManager.format, context.date, context.cachedCount + 1);
    await hooks.trigger(hookNames.POST_TAG, { version });
}

async function handleRelease(
    hooks: HookSystem,
    gitManager: GitManager,
    version: string,
    releaseType: string
): Promise<void> {
    const token = core.getInput('github-token', { required: true });
    const octokit = github.getOctokit(token);

    await hooks.trigger(hookNames.PRE_RELEASE, { version, releaseType });
    await gitManager.createRelease(version, releaseType, octokit, github.context);
    await hooks.trigger(hookNames.POST_RELEASE, { version, releaseType });
}

async function run(): Promise<void> {
    const hooks = new HookSystem();
    const tagCache = new TagCache();

    try {
        // Load and validate configuration
        let config: Config;
        await ActionLogger.group('Loading Configuration', async () => {
            config = await loadConfig();
            ActionLogger.debug('Configuration loaded', config);
        });

        validateInputs(config.format, config.dateFormat);

        // Initialize services
        const generator = new VersionGenerator(config.format, config.dateFormat);
        const gitManager = new GitManager();
        const versionLock = new VersionLock(gitManager);

        // Prepare version context
        const now = new Date();
        const { tags, cachedCount } = await prepareVersionContext(tagCache, generator, now);

        // Generate new version
        const versionContext: VersionContext = {
            date: now,
            tags,
            cachedCount,
        };

        const version = await hooks.trigger(
            hookNames.PRE_VERSION,
            generator.generate(versionContext)
        );

        // Acquire lock for the version
        if (!await versionLock.acquireLock(version)) {
            throw new Error('Failed to acquire version lock. Version might already exist.');
        }

        await hooks.trigger(hookNames.POST_VERSION, { version });

        // Handle tagging if requested
        if (config.shouldTag) {
            await handleTagging(hooks, gitManager, tagCache, version, { date: now, cachedCount });
        }

        // Handle release if requested
        if (config.releaseType) {
            await handleRelease(hooks, gitManager, version, config.releaseType);
        }

        // Set output
        core.setOutput('version', version);
        ActionLogger.info(`✨ Successfully generated version: ${version}`);

    } catch (error) {
        if (error instanceof ValidationError) {
            ActionLogger.error(`Validation Error: ${error.message}`);
            core.setFailed(`Validation Error: ${error.message}`);
            return;
        }

        const errorMessage = error instanceof Error ? error.message : String(error);
        ActionLogger.error(`Error: ${errorMessage}`);
        core.setFailed(`Error: ${errorMessage}`);
    }
}

run();

export default run;
