import type { VersionContext } from './types';
export declare class VersionGenerator {
    private format;
    private dateFormat;
    constructor(format: string, dateFormat: string);
    generatePattern(date: Date): string;
    findHighestCount(tags: string[], pattern: string): number;
    generate({ date, tags, cachedCount }: VersionContext): string;
}
