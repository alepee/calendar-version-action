import type { Container } from '../di/container.js'
import type { ServiceToken } from '../di/tokens.js'

export class ServiceLocator {
    private static instance: ServiceLocator
    private container?: Container

    private constructor() {}

    static getInstance(): ServiceLocator {
        if (!ServiceLocator.instance) {
            ServiceLocator.instance = new ServiceLocator()
        }
        return ServiceLocator.instance
    }

    setContainer(container: Container): void {
        this.container = container
    }

    get<T>(token: ServiceToken): T {
        if (!this.container) {
            throw new Error('Container not initialized')
        }
        return this.container.resolve<T>(token)
    }

    reset(): void {
        this.container = undefined
    }
} 
