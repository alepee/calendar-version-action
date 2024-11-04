import { describe, expect, it } from '@jest/globals';
import { CalverFormatter } from '../../src/utils/calverFormatter.js';

describe('CalverFormatter', () => {
    const testDate = new Date('2024-01-28');

    it.each([
        ['YYYY', '2024'],
        ['YY', '24'],
        ['0Y', '24'],
        ['MM', '1'],
        ['0M', '01'],
        ['WW', '5'],
        ['0W', '05'],
        ['DD', '28'],
        ['0D', '28']
    ])('should format %s correctly', (format, expected) => {
        expect(CalverFormatter.formatDate(testDate, format)).toBe(expected);
    });

    it('should handle combined formats', () => {
        expect(CalverFormatter.formatDate(testDate, 'YYYY.0M.0D')).toBe('2024.01.28');
    });

    it('should handle custom separators', () => {
        expect(CalverFormatter.formatDate(testDate, 'YYYY-MM-DD')).toBe('2024-1-28');
        expect(CalverFormatter.formatDate(testDate, 'YYYY/0M/0D')).toBe('2024/01/28');
    });

    it('should preserve non-matching parts', () => {
        expect(CalverFormatter.formatDate(testDate, 'release-YYYY.0M.0D')).toBe('release-2024.01.28');
    });

    it('should handle repeating patterns', () => {
        expect(CalverFormatter.formatDate(testDate, 'YYYY-YYYY')).toBe('2024-2024');
    });

    describe('year formats', () => {
        it('should handle year 2000', () => {
            const y2k = new Date('2000-01-01');
            expect(CalverFormatter.formatDate(y2k, 'YYYY')).toBe('2000');
            expect(CalverFormatter.formatDate(y2k, 'YY')).toBe('0');
            expect(CalverFormatter.formatDate(y2k, '0Y')).toBe('00');
        });
    });

    describe('month formats', () => {
        it('should handle single digit months', () => {
            const march = new Date('2024-03-01');
            expect(CalverFormatter.formatDate(march, 'MM')).toBe('3');
            expect(CalverFormatter.formatDate(march, '0M')).toBe('03');
        });

        it('should handle december', () => {
            const december = new Date('2024-12-01');
            expect(CalverFormatter.formatDate(december, 'MM')).toBe('12');
            expect(CalverFormatter.formatDate(december, '0M')).toBe('12');
        });
    });

    describe('week formats', () => {
        it('should handle first week', () => {
            const firstWeek = new Date('2024-01-01');
            expect(CalverFormatter.formatDate(firstWeek, 'WW')).toBe('1');
            expect(CalverFormatter.formatDate(firstWeek, '0W')).toBe('01');
        });

        it('should handle last week', () => {
            const lastWeek = new Date('2024-12-31');
            expect(CalverFormatter.formatDate(lastWeek, 'WW')).toBe('1');
            expect(CalverFormatter.formatDate(lastWeek, '0W')).toBe('01');
        });
    });

    describe('day formats', () => {
        it('should handle first day of month', () => {
            const firstDay = new Date('2024-01-01');
            expect(CalverFormatter.formatDate(firstDay, 'DD')).toBe('1');
            expect(CalverFormatter.formatDate(firstDay, '0D')).toBe('01');
        });

        it('should handle last day of month', () => {
            const lastDay = new Date('2024-01-31');
            expect(CalverFormatter.formatDate(lastDay, 'DD')).toBe('31');
            expect(CalverFormatter.formatDate(lastDay, '0D')).toBe('31');
        });
    });
});
