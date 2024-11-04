export class ServiceLocator {
    static instance;
    container;
    constructor() { }
    static getInstance() {
        if (!ServiceLocator.instance) {
            ServiceLocator.instance = new ServiceLocator();
        }
        return ServiceLocator.instance;
    }
    setContainer(container) {
        this.container = container;
    }
    get(token) {
        if (!this.container) {
            throw new Error('Container not initialized');
        }
        return this.container.resolve(token);
    }
    reset() {
        this.container = undefined;
    }
}
