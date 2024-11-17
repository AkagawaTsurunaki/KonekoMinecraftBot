import console from "node:console";

class FieldMetadata {
    name: string
    description: string
    required: boolean
    type: string


    constructor(name: string, description: string, required: boolean, type: string) {
        this.name = name;
        this.description = description;
        this.required = required;
        this.type = type;
    }
}

export function paramMetadata<T>(description: string, required: boolean = true) {
    return function (target: any, propertyKey: string) {
        const metadata = new FieldMetadata(propertyKey, description, required, "undefined");
        const className = target.constructor.name
        Reflect.defineMetadata(`${className}:${propertyKey}:fieldMetadata`, metadata, target);

        console.log()
    }
}

function getMetadata(cls: any) {
    const instance: any = Reflect.construct(cls, []);
    const className = instance.constructor.name

    return Object.keys(instance).map(propertyKey => {
        const fieldMetadata: FieldMetadata = Reflect.getMetadata(`${className}:${propertyKey}:fieldMetadata`, instance)
        const property = Reflect.get(instance, propertyKey, instance);
        fieldMetadata.type = `${typeof property}`;
        return fieldMetadata;
    });
}
