import { getWeek } from 'date-fns';
export class CalverFormatter {
    static TOKEN_HANDLERS = {
        'YYYY': (date) => date.getFullYear().toString(),
        'YY': (date) => (date.getFullYear() % 100).toString(),
        '0Y': (date) => (date.getFullYear() % 100).toString().padStart(2, '0'),
        'MM': (date) => (date.getMonth() + 1).toString(),
        '0M': (date) => (date.getMonth() + 1).toString().padStart(2, '0'),
        'WW': (date) => getWeek(date).toString(),
        '0W': (date) => getWeek(date).toString().padStart(2, '0'),
        'DD': (date) => date.getDate().toString(),
        '0D': (date) => date.getDate().toString().padStart(2, '0')
    };
    static formatDate(date, pattern) {
        return pattern.replace(/YYYY|YY|0Y|MM|0M|WW|0W|DD|0D/g, (match) => {
            const handler = this.TOKEN_HANDLERS[match];
            return handler ? handler(date) : match;
        });
    }
}
