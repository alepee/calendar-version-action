import { describe, expect, it, beforeEach, jest } from '@jest/globals'
import { HookSystem, hookNames } from '../../src/utils/hooks.js'
import type { HookContext } from '../../src/types'

describe('HookSystem', () => {
    let hooks: HookSystem

    beforeEach(() => {
        hooks = new HookSystem()
    })

    it('should define all hook types', () => {
        expect(hookNames).toEqual({
            PRE_VERSION: 'preVersion',
            POST_VERSION: 'postVersion',
            PRE_TAG: 'preTag',
            POST_TAG: 'postTag',
            PRE_RELEASE: 'preRelease',
            POST_RELEASE: 'postRelease'
        })
    })

    it('should return original context when no hooks are registered', async () => {
        const context: HookContext = { 
            version: '1.0.0',
            context: {} as any
        }
        const result = await hooks.trigger('test', context)
        expect(result).toBe(context)
    })

    it('should execute single hook', async () => {
        const mockHook = jest.fn((context: HookContext) => 
            Promise.resolve({ ...context, version: '2.0.0' })
        )
        hooks.register('test', mockHook)

        const context: HookContext = {
            version: '1.0.0',
            context: {} as any
        }
        const result = await hooks.trigger('test', context)

        expect(mockHook).toHaveBeenCalledWith(context)
        expect(result.version).toBe('2.0.0')
    })
}) 
