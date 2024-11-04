interface CalverConfig {
    format?: string;
    dateFormat?: string;
    tag?: boolean;
    release?: 'latest' | 'pre';
    'github-token'?: string;
}
export declare class ConfigLoader {
    static loadConfig(): Promise<CalverConfig>;
    static validateConfig(config: CalverConfig): CalverConfig;
}
export {};
