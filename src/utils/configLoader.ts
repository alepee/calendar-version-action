import * as core from '@actions/core'
import * as fs from 'fs/promises'
import * as path from 'path'
import { ValidationError } from './validateInputs.js'

interface CalverConfig {
    format?: string
    dateFormat?: string
    tag?: boolean
    release?: 'latest' | 'pre'
    'github-token'?: string
}

export class ConfigLoader {
    static async loadConfig(): Promise<CalverConfig> {
        const configPath = path.join(process.env.GITHUB_WORKSPACE || '', '.github/calver.config.json')

        try {
            const exists = await fs.access(configPath).then(() => true).catch(() => false)
            if (!exists) return {}

            const content = await fs.readFile(configPath, 'utf8')
            const config = JSON.parse(content) as CalverConfig

            return this.validateConfig(config)
        } catch (error) {
            throw new ValidationError(`Failed to load config: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }

    static validateConfig(config: CalverConfig): CalverConfig {
        const allowedKeys = ['format', 'dateFormat', 'tag', 'release', 'github-token']
        const unknownKeys = Object.keys(config).filter(key => !allowedKeys.includes(key))

        if (unknownKeys.length > 0) {
            core.warning(`Unknown configuration keys found: ${unknownKeys.join(', ')}`)
        }

        return config
    }
} 
