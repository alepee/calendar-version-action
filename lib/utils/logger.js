import * as core from '@actions/core';
export class ActionLogger {
    static debug(message, data = null) {
        if (process.env.RUNNER_DEBUG === '1') {
            core.debug(this.formatMessage(message, data));
        }
    }
    static info(message, data = null) {
        core.info(this.formatMessage(message, data));
    }
    static warning(message, data = null) {
        core.warning(this.formatMessage(message, data));
    }
    static error(message, data = null) {
        core.error(this.formatMessage(message, data));
    }
    static formatMessage(message, data) {
        if (data) {
            const dataString = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
            return `${message}\n${dataString}`;
        }
        return message;
    }
    static group(name, fn) {
        core.startGroup(name);
        try {
            fn();
        }
        finally {
            core.endGroup();
        }
    }
}
