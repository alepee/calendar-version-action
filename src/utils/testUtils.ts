import type { Container } from '../di/container.js'
import { ServiceLocator } from './serviceLocator.js'
import { SERVICE_TOKENS } from '../di/tokens.js'

export function createTestContainer(): Container {
    const container = new Container()

    // Register mock services
    container.registerInstance(SERVICE_TOKENS.Logger, {
        debug: jest.fn(),
        info: jest.fn(),
        warning: jest.fn(),
        error: jest.fn()
    })

    container.registerInstance(SERVICE_TOKENS.GitManager, {
        getTags: jest.fn(),
        createTag: jest.fn(),
        createRelease: jest.fn()
    })

    // Initialize service locator
    ServiceLocator.getInstance().setContainer(container)

    return container
}

export function cleanupTests(): void {
    ServiceLocator.getInstance().reset()
    jest.clearAllMocks()
} 
