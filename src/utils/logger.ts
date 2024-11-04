import * as core from '@actions/core'

type LogData = string | Record<string, unknown> | null

export class ActionLogger {
    static debug(message: string, data: LogData = null): void {
        if (process.env.RUNNER_DEBUG === '1') {
            core.debug(this.formatMessage(message, data))
        }
    }

    static info(message: string, data: LogData = null): void {
        core.info(this.formatMessage(message, data))
    }

    static warning(message: string, data: LogData = null): void {
        core.warning(this.formatMessage(message, data))
    }

    static error(message: string, data: LogData = null): void {
        core.error(this.formatMessage(message, data))
    }

    static formatMessage(message: string, data: LogData): string {
        if (data) {
            const dataString = typeof data === 'string' ? data : JSON.stringify(data, null, 2)
            return `${message}\n${dataString}`
        }
        return message
    }

    static group(name: string, fn: () => void): void {
        core.startGroup(name)
        try {
            fn()
        } finally {
            core.endGroup()
        }
    }
} 
