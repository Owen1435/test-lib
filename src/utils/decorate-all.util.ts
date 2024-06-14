/** Allows to add a decorator to all methods of the class
 * @example
 *    class User {
 *       .@decorator
 *       create() {}
 *       .@decorator
 *       update() {}
 *    }
 *    .@decorateAll(decorator)
 *    class User {
 *       create() {}
 *       update() {}
 *    }
 */
export const decorateAll = (
    decorator: <T>(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void,
): ClassDecorator => {
    return (target: any) => {
        const descriptors = Object.getOwnPropertyDescriptors(target.prototype);
        for (const [propName, descriptor] of Object.entries(descriptors)) {
            const isMethod = typeof descriptor.value == 'function' && propName !== 'constructor';
            if (!isMethod) {
                continue;
            }
            decorator({ ...target, constructor: { ...target.constructor, name: target.name } as any }, propName, descriptor);
            Object.defineProperty(target.prototype, propName, descriptor);
        }
    };
};

/** Make possible to decorate class or method
 * @example
 *    class User {
 *       .@decorator()
 *       create() {}
 *       .@decorator()
 *       update() {}
 *    }
 *    .@decorator()
 *    class User {
 *       create() {}
 *       update() {}
 *    }
 */
export const decorateClassOrMethod = <T extends object>(decorator: (options?: T) => MethodDecorator) => {
    return (options?: T): ClassDecorator & MethodDecorator => {
        return (...args: any[]) => {
            if (args.length === 1 && args[0] instanceof Function) {
                // decorate class
                return decorateAll(decorator(options))(args[0]);
            }
            // decorate method
            return decorator(options)(args[0], args[1], args[2]);
        };
    };
};
