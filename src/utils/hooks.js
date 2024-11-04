export class HookSystem {
    constructor() {
        this.hooks = new Map();
    }

    register(hookName, callback) {
        if (!this.hooks.has(hookName)) {
            this.hooks.set(hookName, []);
        }
        this.hooks.get(hookName).push(callback);
    }

    async trigger(hookName, context) {
        if (!this.hooks.has(hookName)) return context;

        let currentContext = context;
        for (const callback of this.hooks.get(hookName)) {
            currentContext = await callback(currentContext);
        }
        return currentContext;
    }
}

export const hookNames = {
    PRE_VERSION: 'preVersion',
    POST_VERSION: 'postVersion',
    PRE_TAG: 'preTag',
    POST_TAG: 'postTag',
    PRE_RELEASE: 'preRelease',
    POST_RELEASE: 'postRelease',
};
