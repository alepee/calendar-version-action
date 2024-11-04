import type { VersionPattern } from '../types/calver.js';
export declare class VersionPatternParser {
    static parse(pattern: string): VersionPattern;
    static validate(pattern: string): void;
}
