export declare class TagCache {
    private cache;
    constructor();
    private getKey;
    get(pattern: string, date: Date): number | undefined;
    set(pattern: string, date: Date, count: number): void;
    clear(): void;
}
