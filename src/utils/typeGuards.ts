import type { CalverConfig, VersionComponents } from '../types/calver.js'

export function isCalverConfig(value: unknown): value is CalverConfig {
    if (!value || typeof value !== 'object') return false

    const config = value as Record<string, unknown>
    
    return (
        (config.format === undefined || typeof config.format === 'string') &&
        (config.dateFormat === undefined || typeof config.dateFormat === 'string') &&
        (config.tag === undefined || typeof config.tag === 'boolean') &&
        (config.release === undefined || config.release === 'latest' || config.release === 'pre') &&
        (config['github-token'] === undefined || typeof config['github-token'] === 'string')
    )
}

export function isVersionComponents(value: unknown): value is VersionComponents {
    if (!value || typeof value !== 'object') return false

    const components = value as Record<string, unknown>
    
    return (
        typeof components.year === 'string' &&
        typeof components.month === 'string' &&
        (components.day === undefined || typeof components.day === 'string') &&
        (components.week === undefined || typeof components.week === 'string') &&
        (components.micro === undefined || typeof components.micro === 'string')
    )
} 