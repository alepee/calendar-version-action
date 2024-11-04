import { CalverFormatter } from './utils/calverFormatter';

interface VersionContext {
    date: Date;
    tags: string[];
    cachedCount?: number;
}

class VersionGenerator {
    readonly format: string;
    readonly dateFormat: string;

    constructor(format: string, dateFormat: string) {
        this.format = format;
        this.dateFormat = dateFormat;
    }

    generatePattern(date: Date): string {
        const formattedDate = CalverFormatter.formatDate(date, this.dateFormat);
        return this.format.replace('%NOW%', formattedDate);
    }

    findHighestCount(tags: string[], pattern: string): number {
        const [beforeMicro, afterMicro] = pattern.split('%MICRO%');
        const regex = new RegExp(`^${beforeMicro}([0-9]+)${afterMicro}$`);

        return tags.reduce((maxCount: number, tag: string) => {
            const match = tag.match(regex);
            if (match) {
                const count = parseInt(match[1], 10);
                return Math.max(maxCount, count);
            }
            return maxCount;
        }, -1);
    }

    generate(context: VersionContext): string {
        const pattern = this.generatePattern(context.date);
        if (!pattern.includes('%MICRO%')) {
            return pattern;
        }

        const count = context.cachedCount !== undefined 
            ? context.cachedCount + 1 
            : this.findHighestCount(context.tags, pattern) + 1;

        return pattern.replace('%MICRO%', count.toString());
    }
}

export { VersionGenerator };
