import * as core from '@actions/core';
import * as github from '@actions/github';
import { ConfigLoader } from './utils/configLoader';
import { GitManager } from './gitManager';
import { HookSystem, hookNames } from './utils/hooks';
import { VersionGenerator } from './versionGenerator';
import { VersionLock } from './utils/versionLock';
import { ActionLogger } from './utils/logger';
import { validateInputs, ValidationError } from './validateInputs';
import { TagCache } from './utils/tagCache';

interface Config {
    format: string;
    dateFormat: string;
    shouldTag: boolean;
    releaseType?: string;
}

async function run(): Promise<void> {
    const hooks = new HookSystem();
    const tagCache = new TagCache();

    try {
        // Load and merge configuration
        let config: Config;
        await ActionLogger.group('Loading Configuration', async () => {
            // Load config file
            const fileConfig = await ConfigLoader.loadConfig();

            // Merge with action inputs
            config = {
                format: core.getInput('format') || fileConfig.format || '%NOW%-%COUNT%',
                dateFormat: core.getInput('dateFormat') || fileConfig.dateFormat || 'yyyy.MM.dd',
                shouldTag: (core.getInput('tag') || fileConfig.tag || 'false').toLowerCase() === 'true',
                releaseType: core.getInput('release') || fileConfig.release,
            };

            ActionLogger.debug('Configuration loaded', config);
        });

        // Validate inputs
        validateInputs(config.format, config.dateFormat);

        // Initialize services
        const generator = new VersionGenerator(config.format, config.dateFormat);
        const gitManager = new GitManager();
        const versionLock = new VersionLock(gitManager);

        // Check cache for existing count
        const now = new Date();
        let cachedCount = tagCache.get(config.format, now);
        let tags: string[];

        if (cachedCount === undefined) {
            ActionLogger.debug('Cache miss, fetching tags from Git');
            // Get existing tags only if not in cache
            tags = await gitManager.getTags();
            ActionLogger.debug('Existing tags', tags);

            // Update cache with new tags
            cachedCount = generator.findHighestCount(tags, generator.generatePattern(now));
            tagCache.set(config.format, now, cachedCount);
        } else {
            ActionLogger.debug('Using cached count', { cachedCount });
            tags = []; // Empty array since we'll use cached count
        }

        // Generate new version using cached count if available
        const versionContext = {
            date: now,
            tags,
            cachedCount: cachedCount !== undefined ? cachedCount : -1
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

        // Create tag if requested
        if (config.shouldTag) {
            await hooks.trigger(hookNames.PRE_TAG, { version });
            await gitManager.createTag(version);

            // Increment cached count after successful tag creation
            tagCache.set(config.format, now, (cachedCount !== undefined ? cachedCount : -1) + 1);

            await hooks.trigger(hookNames.POST_TAG, { version });
        }

        // Create release if requested
        if (config.releaseType) {
            const token = core.getInput('github-token', { required: true });
            const octokit = github.getOctokit(token);

            await hooks.trigger(hookNames.PRE_RELEASE, { version, releaseType: config.releaseType });
            await gitManager.createRelease(version, config.releaseType, octokit, github.context);
            await hooks.trigger(hookNames.POST_RELEASE, { version, releaseType: config.releaseType });
        }

        // Set output
        core.setOutput('version', version);
        ActionLogger.info(`✨ Successfully generated version: ${version}`);

    } catch (error) {
        if (error instanceof ValidationError) {
            ActionLogger.error(`Validation Error: ${error.message}`);
            core.setFailed(`Validation Error: ${error.message}`);
        } else {
            ActionLogger.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
            core.setFailed(`Error: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}

run();

export default run;
