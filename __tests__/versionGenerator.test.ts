import { describe, expect, it } from '@jest/globals'
import { VersionGenerator } from '../src/versionGenerator.js'
import type { VersionContext } from '../src/types'

describe('VersionGenerator', () => {
    const generator = new VersionGenerator('v%NOW%-%MICRO%', 'YYYY.MM')
    const testDate = new Date('2024-01-28')

    it('should generate version with micro version', () => {
        const context: VersionContext = {
            date: testDate,
            tags: ['v2024.01-1', 'v2024.01-2']
        }

        const version = generator.generate(context)
        expect(version).toBe('v2024.01-3')
    })

    it('should handle empty tags list', () => {
        const context: VersionContext = {
            date: testDate,
            tags: []
        }

        const version = generator.generate(context)
        expect(version).toBe('v2024.01-0')
    })

    it('should use cached count when provided', () => {
        const context: VersionContext = {
            date: testDate,
            tags: ['v2024.01-1', 'v2024.01-2'],
            cachedCount: 5
        }

        const version = generator.generate(context)
        expect(version).toBe('v2024.01-6')
    })

    it('should generate version without micro version', () => {
        const simpleGenerator = new VersionGenerator('v%NOW%', 'YYYY.MM')
        const context: VersionContext = {
            date: testDate,
            tags: []
        }

        const version = simpleGenerator.generate(context)
        expect(version).toBe('v2024.01')
    })
}) 
