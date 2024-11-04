import type { CalverConfig } from '../types/calver.js';
export declare class CalverConfigBuilder {
    private config;
    withFormat(format: string): this;
    withDateFormat(dateFormat: string): this;
    withTag(tag: boolean): this;
    withRelease(release: 'latest' | 'pre'): this;
    withGithubToken(token: string): this;
    build(): CalverConfig;
}
