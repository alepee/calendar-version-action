export type VersionContext = {
    date: Date;
    tags: string[];
    cachedCount?: number;
};

export interface HookContext {
    [key: string]: any;
} 
