import type { CalverConfig } from '../types/calver.js';
export declare class ConfigValidator {
    private static readonly ALLOWED_KEYS;
    private static readonly RELEASE_TYPES;
    static validate(config: unknown): CalverConfig;
    private static isObject;
}
