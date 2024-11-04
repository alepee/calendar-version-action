import * as core from '@actions/core';
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
}

interface VersionContext {
    date: Date;
    tags: string[];
    cachedCount: number;
    version?: string;
}

async function loadConfig(): Promise<Config> {
    const fileConfig = await ConfigLoader.loadConfig();
    
    return {
        format: core.getInput('format') || fileConfig.format || '%NOW%-%COUNT%',
        dateFormat: core.getInput('dateFormat') || fileConfig.dateFormat || 'yyyy.MM.dd',
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

async function run(): Promise<void> {
    const hooks = new HookSystem();
    const tagCache = new TagCache();

    try {
        // Load and validate configuration
        const config = await loadConfig();
        ActionLogger.debug('Configuration loaded', config);

        // Validate inputs
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

        const version = generator.generate(versionContext);
        await hooks.trigger(
            hookNames.PRE_VERSION,
            { version }
        );

        // Acquire lock for the version
        if (!await versionLock.acquireLock(version)) {
            throw new Error('Failed to acquire version lock. Version might already exist.');
        }

        await hooks.trigger(hookNames.POST_VERSION, { version });

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
