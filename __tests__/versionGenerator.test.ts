import { VersionGenerator } from '../src/versionGenerator';
import type { VersionContext } from '../src/types';

describe('VersionGenerator', () => {
    let generator: VersionGenerator;

    beforeEach(() => {
        generator = new VersionGenerator('%NOW%-%MICRO%', 'YYYY.0M.0D');
    });

    describe('generatePattern', () => {
        it('should replace %NOW% with formatted date', () => {
            const date = new Date('2024-01-28');
            const pattern = generator.generatePattern(date);
            expect(pattern).toBe('2024.01.28-%MICRO%');
        });

        it('should handle Ubuntu-style format (YY.0M)', () => {
            generator = new VersionGenerator('%NOW%', 'YY.0M');
            const date = new Date('2024-01-28');
            const pattern = generator.generatePattern(date);
            expect(pattern).toBe('24.01');
        });

        it('should handle ElementaryOS-style format (YYYY.MM.%MICRO%)', () => {
            generator = new VersionGenerator('%NOW%.%MICRO%', 'YYYY.MM');
            const date = new Date('2024-01-28');
            const pattern = generator.generatePattern(date);
            expect(pattern).toBe('2024.1.%MICRO%');
        });

        it('should handle API versioning format (YYYY.MINOR.%MICRO%)', () => {
            generator = new VersionGenerator('%NOW%.1.%MICRO%', 'YYYY');
            const date = new Date('2024-01-28');
            const pattern = generator.generatePattern(date);
            expect(pattern).toBe('2024.1.%MICRO%');
        });

        it('should handle week-based format', () => {
            generator = new VersionGenerator('%NOW%.%MICRO%', 'YYYY.0W');
            const date = new Date('2024-01-28');
            const pattern = generator.generatePattern(date);
            expect(pattern).toBe('2024.05.%MICRO%');
        });
    });

    describe('findHighestCount', () => {
        it('should return -1 when no matching tags exist', () => {
            const pattern = '2024.01.28-%MICRO%';
            const tags = ['invalid', '2023.01.28-0'];
            expect(generator.findHighestCount(tags, pattern)).toBe(-1);
        });

        it('should find highest MICRO from matching tags', () => {
            const pattern = '2024.01.28-%MICRO%';
            const tags = ['2024.01.28-0', '2024.01.28-1', '2024.01.28-2'];
            expect(generator.findHighestCount(tags, pattern)).toBe(2);
        });

        it('should handle mixed version formats', () => {
            const pattern = '2024.01.28-%MICRO%';
            const tags = [
                '2024.01.28-1',
                'invalid',
                '2024.01.28-2',
                '2024.01.27-5',
                'v2024.01.28-0'
            ];
            expect(generator.findHighestCount(tags, pattern)).toBe(2);
        });

        it('should handle ElementaryOS-style version format', () => {
            generator = new VersionGenerator('%NOW%.%MICRO%', 'YYYY.MM');
            const pattern = '2024.1.%MICRO%';
            const tags = ['2024.1.0', '2024.1.1', '2024.1.2'];
            expect(generator.findHighestCount(tags, pattern)).toBe(2);
        });
    });

    describe('generate', () => {
        it('should generate version with MICRO 0 when no tags exist', () => {
            const version = generator.generate({
                date: new Date('2024-01-28'),
                tags: [],
                cachedCount: -1
            } as VersionContext);
            expect(version).toBe('2024.01.28-0');
        });

        it('should increment highest existing MICRO', () => {
            const version = generator.generate({
                date: new Date('2024-01-28'),
                tags: ['2024.01.28-0', '2024.01.28-1'],
                cachedCount: -1
            } as VersionContext);
            expect(version).toBe('2024.01.28-2');
        });

        it('should use cached count when provided', () => {
            const version = generator.generate({
                date: new Date('2024-01-28'),
                tags: [],
                cachedCount: 5
            } as VersionContext);
            expect(version).toBe('2024.01.28-6');
        });

        it('should handle ElementaryOS format', () => {
            generator = new VersionGenerator('%NOW%.%MICRO%', 'YYYY.MM');
            const version = generator.generate({
                date: new Date('2024-01-28'),
                tags: ['2024.1.0', '2024.1.1'],
                cachedCount: -1
            } as VersionContext);
            expect(version).toBe('2024.1.2');
        });

        it('should handle Ubuntu format', () => {
            generator = new VersionGenerator('%NOW%', 'YY.0M');
            const version = generator.generate({
                date: new Date('2024-01-28'),
                tags: [],
                cachedCount: -1
            } as VersionContext);
            expect(version).toBe('24.01');
        });

        it('should handle API versioning format', () => {
            generator = new VersionGenerator('%NOW%.1.%MICRO%', 'YYYY');
            const version = generator.generate({
                date: new Date('2024-01-28'),
                tags: ['2024.1.0'],
                cachedCount: -1
            } as VersionContext);
            expect(version).toBe('2024.1.1');
        });

        it('should handle custom release format', () => {
            generator = new VersionGenerator('release-%NOW%-build-%MICRO%', 'YY.0M');
            const version = generator.generate({
                date: new Date('2024-01-28'),
                tags: [],
                cachedCount: -1
            } as VersionContext);
            expect(version).toBe('release-24.01-build-0');
        });

        it('should handle pre-release format', () => {
            generator = new VersionGenerator('%NOW%-%MICRO%-beta', 'YYYY.0M.0D');
            const version = generator.generate({
                date: new Date('2024-01-28'),
                tags: [],
                cachedCount: -1
            } as VersionContext);
            expect(version).toBe('2024.01.28-0-beta');
        });
    });
});
