import { describe, expect, it, beforeEach } from '@jest/globals'
import { TagCache } from '../../src/utils/tagCache.js'

describe('TagCache', () => {
    let cache: TagCache
    const testDate = new Date('2024-01-28')
    const testPattern = '%NOW%-%COUNT%'

    beforeEach(() => {
        cache = new TagCache()
    })

    it('should return undefined for non-existent key', () => {
        expect(cache.get(testPattern, testDate)).toBeUndefined()
    })

    it('should store and retrieve value', () => {
        cache.set(testPattern, testDate, 5)
        expect(cache.get(testPattern, testDate)).toBe(5)
    })

    it('should generate consistent keys for same pattern and date', () => {
        cache.set(testPattern, testDate, 5)
        const value1 = cache.get(testPattern, testDate)
        const value2 = cache.get(testPattern, testDate)
        expect(value1).toBe(value2)
    })

    it('should clear all cached values', () => {
        cache.set(testPattern, testDate, 5)
        cache.clear()
        expect(cache.get(testPattern, testDate)).toBeUndefined()
    })
}) 
