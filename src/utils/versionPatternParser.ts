import type { VersionPattern } from '../types/calver.js'
import { ValidationError } from '../errors/index.js'

export class VersionPatternParser {
    static parse(pattern: string): VersionPattern {
        if (!pattern.includes('%NOW%')) {
            throw new ValidationError('Pattern must include %NOW% placeholder')
        }

        const parts = pattern.split('%MICRO%')
        
        if (parts.length > 2) {
            throw new ValidationError('Pattern can only include one %MICRO% placeholder')
        }

        return {
            beforeMicro: parts[0] || '',
            afterMicro: parts[1] || '',
            hasMicro: parts.length === 2
        }
    }

    static validate(pattern: string): void {
        const placeholders = pattern.match(/%[A-Z]+%/g) || []
        const validPlaceholders = new Set(['%NOW%', '%MICRO%'])
        
        const invalidPlaceholders = placeholders.filter(p => !validPlaceholders.has(p))
        if (invalidPlaceholders.length > 0) {
            throw new ValidationError(
                `Invalid placeholders found: ${invalidPlaceholders.join(', ')}`
            )
        }
    }
} 
