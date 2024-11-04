import { CalverFormatter } from './utils/calverFormatter';

interface GenerateOptions {
    date: Date;
    tags: string[];
    cachedCount?: number;
}

class VersionGenerator {
    private format: string;
    private dateFormat: string;

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

    generate({ date, tags, cachedCount = -1 }: GenerateOptions): string {
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

export { VersionGenerator };
