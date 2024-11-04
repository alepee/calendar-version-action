import type { Container } from '../di/container.js';
import type { ServiceToken } from '../di/tokens.js';
export declare class ServiceLocator {
    private static instance;
    private container?;
    private constructor();
    static getInstance(): ServiceLocator;
    setContainer(container: Container): void;
    get<T>(token: ServiceToken): T;
    reset(): void;
}
