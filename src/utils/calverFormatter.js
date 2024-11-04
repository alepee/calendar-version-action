import { getWeek } from 'date-fns';

export class CalverFormatter {
    static formatDate(date, pattern) {
        return pattern.replace(/YYYY|YY|0Y|MM|0M|WW|0W|DD|0D/g, (match) => {
            switch (match) {
                case 'YYYY':
                    return date.getFullYear().toString();
                case 'YY':
                    return (date.getFullYear() % 100).toString();
                case '0Y':
                    return (date.getFullYear() % 100).toString().padStart(2, '0');
                case 'MM':
                    return (date.getMonth() + 1).toString();
                case '0M':
                    return (date.getMonth() + 1).toString().padStart(2, '0');
                case 'WW': {
                    return getWeek(date).toString();
                }
                case '0W': {
                    return getWeek(date).toString().padStart(2, '0');
                }
                case 'DD':
                    return date.getDate().toString();
                case '0D':
                    return date.getDate().toString().padStart(2, '0');
                default:
                    return match;
            }
        });
    }
}
