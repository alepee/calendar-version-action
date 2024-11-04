import type { CalverConfig } from '../types/calver.js'

export class CalverConfigBuilder {
    private config: Partial<CalverConfig> = {}

    withFormat(format: string): this {
        this.config.format = format
        return this
    }

    withDateFormat(dateFormat: string): this {
        this.config.dateFormat = dateFormat
        return this
    }

    withTag(tag: boolean): this {
        this.config.tag = tag
        return this
    }

    withRelease(release: 'latest' | 'pre'): this {
        this.config.release = release
        return this
    }

    withGithubToken(token: string): this {
        this.config['github-token'] = token
        return this
    }

    build(): CalverConfig {
        return {
            format: this.config.format ?? '%NOW%-%MICRO%',
            dateFormat: this.config.dateFormat ?? 'YYYY.0M.0D',
            tag: this.config.tag ?? false,
            release: this.config.release,
            'github-token': this.config['github-token']
        }
    }
} 
