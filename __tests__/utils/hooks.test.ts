import type { HookContext } from '../../src/types';
import { HookSystem, hookNames } from '../../src/utils/hooks';

describe('HookSystem', () => {
    let hooks: HookSystem;

    beforeEach(() => {
        hooks = new HookSystem();
    });

    it('should define all hook types', () => {
        expect(hookNames).toEqual({
            PRE_VERSION: 'preVersion',
            POST_VERSION: 'postVersion'
        });
    });

    it('should return original context when no hooks are registered', async () => {
        const context = { version: '1.0.0' };
        const result = await hooks.trigger('test', context);
        expect(result).toBe(context);
    });

    it('should execute single hook', async () => {
        const mockHook = jest.fn(async (context: HookContext) => ({ ...context, modified: true } as HookContext));
        hooks.register('test', mockHook);

        const context: HookContext = { test: true };
        const result = await hooks.trigger('test', context);

        expect(mockHook).toHaveBeenCalledWith(context);
        expect(result).toEqual({ test: true, modified: true });
    });

    it('should execute multiple hooks in order', async () => {
        const results: number[] = [];
        hooks.register('test', async (context: HookContext) => {
            results.push(1);
            return context;
        });
        hooks.register('test', async (context: HookContext) => {
            results.push(2);
            return context;
        });

        await hooks.trigger('test', {});
        expect(results).toEqual([1, 2]);
    });

    it('should pass modified context through hook chain', async () => {
        hooks.register('test', async (context: HookContext) => ({ ...context, step1: true } as HookContext));
        hooks.register('test', async (context: HookContext) => ({ ...context, step2: true } as HookContext));

        const result = await hooks.trigger('test', { initial: true } as HookContext);

        expect(result).toEqual({
            initial: true,
            step1: true,
            step2: true
        });
    });

    it('should handle async hooks', async () => {
        hooks.register('test', async (context: HookContext) => {
            await new Promise(resolve => setTimeout(resolve, 10));
            return { ...context, async: true } as HookContext;
        });

        const result = await hooks.trigger('test', {});
        expect(result).toEqual({ async: true });
    });
});
