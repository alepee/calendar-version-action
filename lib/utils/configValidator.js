import * as core from '@actions/core';
import { ConfigError } from '../errors/index.js';
export class ConfigValidator {
    static ALLOWED_KEYS = new Set([
        'format',
        'dateFormat',
        'tag',
        'release',
        'github-token'
    ]);
    static RELEASE_TYPES = new Set(['latest', 'pre']);
    static validate(config) {
        if (!this.isObject(config)) {
            throw new ConfigError('Configuration must be an object');
        }
        const validatedConfig = {};
        const unknownKeys = [];
        for (const [key, value] of Object.entries(config)) {
            if (!this.ALLOWED_KEYS.has(key)) {
                unknownKeys.push(key);
                continue;
            }
            switch (key) {
                case 'format':
                case 'dateFormat':
                case 'github-token':
                    if (typeof value === 'string') {
                        validatedConfig[key] = value;
                    }
                    break;
                case 'tag':
                    if (typeof value === 'boolean') {
                        validatedConfig.tag = value;
                    }
                    break;
                case 'release':
                    if (typeof value === 'string' && this.RELEASE_TYPES.has(value)) {
                        validatedConfig.release = value;
                    }
                    break;
            }
        }
        if (unknownKeys.length > 0) {
            core.warning(`Unknown configuration keys found: ${unknownKeys.join(', ')}`);
        }
        return validatedConfig;
    }
    static isObject(value) {
        return typeof value === 'object' && value !== null && !Array.isArray(value);
    }
}
