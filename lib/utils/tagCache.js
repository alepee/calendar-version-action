export class TagCache {
    cache;
    constructor() {
        this.cache = new Map();
    }
    getKey(pattern, date) {
        return `${pattern}-${date.toISOString().split('T')[0]}`;
    }
    get(pattern, date) {
        return this.cache.get(this.getKey(pattern, date));
    }
    set(pattern, date, count) {
        this.cache.set(this.getKey(pattern, date), count);
    }
    clear() {
        this.cache.clear();
    }
}
