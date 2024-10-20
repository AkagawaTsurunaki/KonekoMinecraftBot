import {clamp} from "../../util/math";

export function range(min: number, max: number) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            return clamp(originalMethod.apply(this, args), min, max)
        };
        return descriptor;
    };
}