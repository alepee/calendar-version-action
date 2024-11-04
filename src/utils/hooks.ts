type HookCallback<T> = (context: T) => Promise<T>;

class HookSystem<T> {
    private hooks: Map<string, HookCallback<T>[]>;

    constructor() {
        this.hooks = new Map();
    }

    register(hookName: string, callback: HookCallback<T>): void {
        if (!this.hooks.has(hookName)) {
            this.hooks.set(hookName, []);
        }
        this.hooks.get(hookName)!.push(callback);
    }

    async trigger(hookName: string, context: T): Promise<T> {
        if (!this.hooks.has(hookName)) return context;

        let currentContext = context;
        for (const callback of this.hooks.get(hookName)!) {
            currentContext = await callback(currentContext);
        }
        return currentContext;
    }
}

const hookNames = {
    PRE_VERSION: 'preVersion',
    POST_VERSION: 'postVersion',
    PRE_TAG: 'preTag',
    POST_TAG: 'postTag',
    PRE_RELEASE: 'preRelease',
    POST_RELEASE: 'postRelease',
} as const;

export type HookName = typeof hookNames[keyof typeof hookNames];
export { HookSystem, hookNames };
