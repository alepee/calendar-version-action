type HookCallback<T> = (context: T) => Promise<T>;

interface HookContext {
    version?: string;
    releaseType?: string;
    date?: Date;
    tags?: string[];
    cachedCount?: number;
}

class HookSystem {
    private hooks: Map<string, HookCallback<HookContext>[]>;

    constructor() {
        this.hooks = new Map();
    }

    register(hookName: string, callback: HookCallback<HookContext>): void {
        if (!this.hooks.has(hookName)) {
            this.hooks.set(hookName, []);
        }
        this.hooks.get(hookName)!.push(callback);
    }

    async trigger(hookName: string, context: HookContext): Promise<HookContext> {
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
} as const;

export type HookName = typeof hookNames[keyof typeof hookNames];
export { HookSystem, hookNames };
