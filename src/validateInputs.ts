export class ValidationError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'ValidationError'
    }
}

export function validateInputs(format: string, dateFormat: string): boolean {
    if (!format.includes('%NOW%')) {
        throw new ValidationError('Format must include %NOW% placeholder')
    }

    try {
        const now = new Date()
        format(now, dateFormat)
    } catch (error) {
        throw new ValidationError(`Invalid date format: ${dateFormat}. Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }

    return true
} 