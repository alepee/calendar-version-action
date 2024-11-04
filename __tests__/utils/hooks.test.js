const { HookSystem, hookNames } = require('../../src/utils/hooks');

describe('HookSystem', () => {
    let hooks;

    beforeEach(() => {
        hooks = new HookSystem();
    });

    it('should define all hook types', () => {
        expect(hookNames).toEqual({
            PRE_VERSION: 'preVersion',
            POST_VERSION: 'postVersion',
            PRE_TAG: 'preTag',
            POST_TAG: 'postTag',
            PRE_RELEASE: 'preRelease',
            POST_RELEASE: 'postRelease'
        });
    });

    it('should return original context when no hooks are registered', async () => {
        const context = { test: true };
        const result = await hooks.trigger('test', context);
        expect(result).toBe(context);
    });

    it('should execute single hook', async () => {
        const mockHook = jest.fn(context => ({ ...context, modified: true }));
        hooks.register('test', mockHook);

        const context = { test: true };
        const result = await hooks.trigger('test', context);

        expect(mockHook).toHaveBeenCalledWith(context);
        expect(result).toEqual({ test: true, modified: true });
    });

    it('should execute multiple hooks in order', async () => {
        const results = [];
        hooks.register('test', async context => {
            results.push(1);
            return context;
        });
        hooks.register('test', async context => {
            results.push(2);
            return context;
        });

        await hooks.trigger('test', {});
        expect(results).toEqual([1, 2]);
    });

    it('should pass modified context through hook chain', async () => {
        hooks.register('test', context => ({ ...context, step1: true }));
        hooks.register('test', context => ({ ...context, step2: true }));

        const result = await hooks.trigger('test', { initial: true });

        expect(result).toEqual({
            initial: true,
            step1: true,
            step2: true
        });
    });

    it('should handle async hooks', async () => {
        hooks.register('test', async context => {
            await new Promise(resolve => setTimeout(resolve, 10));
            return { ...context, async: true };
        });

        const result = await hooks.trigger('test', {});
        expect(result).toEqual({ async: true });
    });
});
