import * as core from '@actions/core'
import type { CalverConfig } from '../types/calver.js'
import { ConfigError } from '../errors/index.js'

export class ConfigValidator {
    private static readonly ALLOWED_KEYS: Set<keyof CalverConfig> = new Set([
        'format',
        'dateFormat',
        'tag',
        'release',
        'github-token'
    ])

    private static readonly RELEASE_TYPES = new Set(['latest', 'pre'])

    static validate(config: unknown): CalverConfig {
        if (!this.isObject(config)) {
            throw new ConfigError('Configuration must be an object')
        }

        const validatedConfig: Partial<CalverConfig> = {}
        const unknownKeys: string[] = []

        for (const [key, value] of Object.entries(config)) {
            if (!this.ALLOWED_KEYS.has(key as keyof CalverConfig)) {
                unknownKeys.push(key)
                continue
            }

            switch (key) {
                case 'format':
                case 'dateFormat':
                case 'github-token':
                    if (typeof value === 'string') {
                        validatedConfig[key] = value
                    }
                    break
                case 'tag':
                    if (typeof value === 'boolean') {
                        validatedConfig.tag = value
                    }
                    break
                case 'release':
                    if (typeof value === 'string' && this.RELEASE_TYPES.has(value)) {
                        validatedConfig.release = value as 'latest' | 'pre'
                    }
                    break
            }
        }

        if (unknownKeys.length > 0) {
            core.warning(`Unknown configuration keys found: ${unknownKeys.join(', ')}`)
        }

        return validatedConfig as CalverConfig
    }

    private static isObject(value: unknown): value is Record<string, unknown> {
        return typeof value === 'object' && value !== null && !Array.isArray(value)
    }
} 
