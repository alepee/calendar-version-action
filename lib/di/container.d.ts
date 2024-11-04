import type { Constructor } from '../types/common.js';
export declare class Container {
    private services;
    private singletons;
    register<T>(token: string, implementation: Constructor<T>): void;
    registerSingleton<T>(token: string, implementation: Constructor<T>): void;
    registerInstance<T>(token: string, instance: T): void;
    resolve<T>(token: string): T;
}
