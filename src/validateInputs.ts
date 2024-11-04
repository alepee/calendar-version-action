import { CalverFormatter } from './utils/calverFormatter';

export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

export function validateInputs(format: string, dateFormat: string): boolean {
    if (!format.includes('%NOW%')) {
        throw new ValidationError('Format must include %NOW% placeholder');
    }

    try {
        const now = new Date();
        CalverFormatter.formatDate(now, dateFormat);
    } catch (error) {
        throw new ValidationError(`Invalid date format: ${dateFormat}. Error: ${error instanceof Error ? error.message : String(error)}`);
    }

    return true;
}
