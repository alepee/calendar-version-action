export class Container {
    services = new Map();
    singletons = new Map();
    register(token, implementation) {
        this.services.set(token, implementation);
    }
    registerSingleton(token, implementation) {
        this.services.set(token, implementation);
        this.singletons.set(token, null);
    }
    registerInstance(token, instance) {
        this.singletons.set(token, instance);
    }
    resolve(token) {
        if (this.singletons.has(token)) {
            if (this.singletons.get(token) === null) {
                const Implementation = this.services.get(token);
                this.singletons.set(token, new Implementation(this));
            }
            return this.singletons.get(token);
        }
        const Implementation = this.services.get(token);
        if (!Implementation) {
            throw new Error(`No implementation found for ${token}`);
        }
        return new Implementation(this);
    }
}
