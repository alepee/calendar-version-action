type LogData = string | Record<string, unknown> | null;
export declare class ActionLogger {
    static debug(message: string, data?: LogData): void;
    static info(message: string, data?: LogData): void;
    static warning(message: string, data?: LogData): void;
    static error(message: string, data?: LogData): void;
    static formatMessage(message: string, data: LogData): string;
    static group(name: string, fn: () => void): void;
}
export {};
