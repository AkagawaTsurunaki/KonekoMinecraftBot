let _lock = false

export function lock() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            if (_lock) {
                return
            }
            _lock = true
            const result = await originalMethod.apply(this, args)
            _lock = false
            return result
        };
        return descriptor;
    };
}