import { getWeek } from 'date-fns'
import type { DateFormatToken } from '../types/calver.js'

export class CalverFormatter {
    private static readonly TOKEN_HANDLERS: Record<DateFormatToken, (date: Date) => string> = {
        'YYYY': (date: Date) => date.getFullYear().toString(),
        'YY': (date: Date) => (date.getFullYear() % 100).toString(),
        '0Y': (date: Date) => (date.getFullYear() % 100).toString().padStart(2, '0'),
        'MM': (date: Date) => (date.getMonth() + 1).toString(),
        '0M': (date: Date) => (date.getMonth() + 1).toString().padStart(2, '0'),
        'WW': (date: Date) => getWeek(date).toString(),
        '0W': (date: Date) => getWeek(date).toString().padStart(2, '0'),
        'DD': (date: Date) => date.getDate().toString(),
        '0D': (date: Date) => date.getDate().toString().padStart(2, '0')
    }

    static formatDate(date: Date, pattern: string): string {
        return pattern.replace(
            /YYYY|YY|0Y|MM|0M|WW|0W|DD|0D/g,
            (match: string): string => {
                const handler = this.TOKEN_HANDLERS[match as DateFormatToken]
                return handler ? handler(date) : match
            }
        )
    }
} 
