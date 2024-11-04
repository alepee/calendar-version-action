import type { Constructor } from '../types/common.js'

export class Container {
    private services: Map<string, any> = new Map()
    private singletons: Map<string, any> = new Map()

    register<T>(token: string, implementation: Constructor<T>): void {
        this.services.set(token, implementation)
    }

    registerSingleton<T>(token: string, implementation: Constructor<T>): void {
        this.services.set(token, implementation)
        this.singletons.set(token, null)
    }

    registerInstance<T>(token: string, instance: T): void {
        this.singletons.set(token, instance)
    }

    resolve<T>(token: string): T {
        if (this.singletons.has(token)) {
            if (this.singletons.get(token) === null) {
                const Implementation = this.services.get(token)
                this.singletons.set(token, new Implementation(this))
            }
            return this.singletons.get(token)
        }

        const Implementation = this.services.get(token)
        if (!Implementation) {
            throw new Error(`No implementation found for ${token}`)
        }

        return new Implementation(this)
    }
} 
