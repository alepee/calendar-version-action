import { CalverFormatter } from './utils/calverFormatter.js';

export class VersionGenerator {
    constructor(format, dateFormat) {
        this.format = format;
        this.dateFormat = dateFormat;
    }

    generatePattern(date) {
        const formattedDate = CalverFormatter.formatDate(date, this.dateFormat);
        return this.format.replace('%NOW%', formattedDate);
    }

    findHighestCount(tags, pattern) {
        const [beforeMicro, afterMicro] = pattern.split('%MICRO%');
        const regex = new RegExp(`^${beforeMicro}([0-9]+)${afterMicro}$`);

        return tags.reduce((maxCount, tag) => {
            const match = tag.match(regex);
            if (match) {
                const count = parseInt(match[1], 10);
                return Math.max(maxCount, count);
            }
            return maxCount;
        }, -1);
    }

    generate({ date, tags, cachedCount = -1 }) {
        const pattern = this.generatePattern(date);
        if (!pattern.includes('%MICRO%')) {
            return pattern;
        }

        const micro = cachedCount !== -1
            ? cachedCount + 1
            : this.findHighestCount(tags, pattern) + 1;

        const [beforeMicro, afterMicro] = pattern.split('%MICRO%');
        const version = `${beforeMicro || ''}${micro}${afterMicro || ''}`;
        return version;
    }
}
