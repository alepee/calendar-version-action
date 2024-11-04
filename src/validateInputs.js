export class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

export function validateInputs(format, dateFormat) {
    if (!format.includes('%NOW%')) {
        throw new ValidationError('Format must include %NOW% placeholder');
    }

    try {
        const now = new Date();
        format(now, dateFormat);
    } catch (error) {
        throw new ValidationError(`Invalid date format: ${dateFormat}. Error: ${error.message}`);
    }

    return true;
}
