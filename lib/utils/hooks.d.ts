import type { HookCallback, HookContext } from '../types';
export declare class HookSystem {
    private hooks;
    constructor();
    register(hookName: string, callback: HookCallback): void;
    trigger(hookName: string, context: HookContext): Promise<HookContext>;
}
export declare const hookNames: {
    readonly PRE_VERSION: "preVersion";
    readonly POST_VERSION: "postVersion";
    readonly PRE_TAG: "preTag";
    readonly POST_TAG: "postTag";
    readonly PRE_RELEASE: "preRelease";
    readonly POST_RELEASE: "postRelease";
};
export type HookName = typeof hookNames[keyof typeof hookNames];
