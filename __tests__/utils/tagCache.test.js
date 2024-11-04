import { describe, expect, it, beforeEach } from '@jest/globals';
import { TagCache } from '../../src/utils/tagCache.js';

describe('TagCache', () => {
    let cache;
    const testDate = new Date('2024-01-28');
    const testPattern = '%NOW%-%COUNT%';

    beforeEach(() => {
        cache = new TagCache();
    });

    it('should return undefined for non-existent key', () => {
        expect(cache.get(testPattern, testDate)).toBeUndefined();
    });

    it('should store and retrieve value', () => {
        cache.set(testPattern, testDate, 5);
        expect(cache.get(testPattern, testDate)).toBe(5);
    });

    it('should generate consistent keys for same pattern and date', () => {
        cache.set(testPattern, testDate, 5);
        const value1 = cache.get(testPattern, testDate);
        const value2 = cache.get(testPattern, testDate);
        expect(value1).toBe(value2);
    });

    it('should handle different patterns', () => {
        const pattern1 = 'pattern1-%NOW%-%COUNT%';
        const pattern2 = 'pattern2-%NOW%-%COUNT%';

        cache.set(pattern1, testDate, 5);
        cache.set(pattern2, testDate, 10);

        expect(cache.get(pattern1, testDate)).toBe(5);
        expect(cache.get(pattern2, testDate)).toBe(10);
    });

    it('should handle different dates', () => {
        const date1 = new Date('2024-01-28');
        const date2 = new Date('2024-01-29');

        cache.set(testPattern, date1, 5);
        cache.set(testPattern, date2, 10);

        expect(cache.get(testPattern, date1)).toBe(5);
        expect(cache.get(testPattern, date2)).toBe(10);
    });

    it('should clear all cached values', () => {
        cache.set(testPattern, testDate, 5);
        expect(cache.get(testPattern, testDate)).toBe(5);

        cache.clear();
        expect(cache.get(testPattern, testDate)).toBeUndefined();
    });
});
