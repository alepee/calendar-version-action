import * as core from '@actions/core'
import * as github from '@actions/github'
import { ConfigLoader } from './utils/configLoader.js'
import { GitManager } from './gitManager.js'
import { HookSystem, hookNames } from './utils/hooks.js'
import { VersionGenerator } from './versionGenerator.js'
import { VersionLock } from './utils/versionLock.js'
import { ActionLogger } from './utils/logger.js'
import { validateInputs, ValidationError } from './validateInputs.js'
import type { Octokit, HookContext } from './types'

interface ActionInputs {
    format: string
    dateFormat: string
    tag: boolean
    release?: 'latest' | 'pre'
    githubToken?: string
}

async function getInputs(): Promise<ActionInputs> {
    return {
        format: core.getInput('format'),
        dateFormat: core.getInput('dateFormat'),
        tag: core.getBooleanInput('tag'),
        release: core.getInput('release') as 'latest' | 'pre' | undefined,
        githubToken: core.getInput('github-token')
    }
}

async function run(): Promise<void> {
    try {
        const inputs = await getInputs()
        const config = await ConfigLoader.loadConfig()
        
        // Merge config with inputs
        const format = config.format || inputs.format
        const dateFormat = config.dateFormat || inputs.dateFormat
        const shouldTag = config.tag || inputs.tag
        const releaseType = config.release || inputs.release
        const token = config.['github-token'] || inputs.githubToken

        validateInputs(format, dateFormat)

        const gitManager = new GitManager()
        const versionGenerator = new VersionGenerator(format, dateFormat)
        const versionLock = new VersionLock(gitManager)
        const hookSystem = new HookSystem()

        let octokit: Octokit | undefined
        if (token) {
            octokit = github.getOctokit(token)
        }

        const tags = await gitManager.getTags()
        const date = new Date()

        // Generate version
        let hookContext: HookContext = {
            version: '',
            context: github.context,
            octokit
        }

        hookContext = await hookSystem.trigger(hookNames.PRE_VERSION, hookContext)
        
        const version = versionGenerator.generate({
            date,
            tags
        })
        
        hookContext.version = version
        hookContext = await hookSystem.trigger(hookNames.POST_VERSION, hookContext)

        // Create tag if requested
        if (shouldTag) {
            hookContext = await hookSystem.trigger(hookNames.PRE_TAG, hookContext)
            
            const lockAcquired = await versionLock.acquireLock(version)
            if (!lockAcquired) {
                throw new Error(`Failed to acquire lock for version ${version}`)
            }

            await gitManager.createTag(version)
            hookContext = await hookSystem.trigger(hookNames.POST_TAG, hookContext)
        }
    } catch (error) {
        core.setFailed(error.message)
    }
}

run() 
