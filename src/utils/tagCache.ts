class TagCache {
    private cache: Map<string, number>;

    constructor() {
        this.cache = new Map();
    }

    private getKey(pattern: string, date: Date): string {
        return `${pattern}-${date.toISOString().split('T')[0]}`;
    }

    get(pattern: string, date: Date): number | undefined {
        return this.cache.get(this.getKey(pattern, date));
    }

    set(pattern: string, date: Date, count: number): void {
        this.cache.set(this.getKey(pattern, date), count);
    }

    clear(): void {
        this.cache.clear();
    }
}

export { TagCache };
