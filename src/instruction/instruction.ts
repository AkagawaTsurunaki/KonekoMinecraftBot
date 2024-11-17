import {ExtendedBot} from "../extension/extendedBot";
import 'reflect-metadata';
import * as console from "node:console";

export class Instruction {
    command: string
    args: Array<string> | null = null
    argTypes: Array<string | boolean | number> | null = null
    func: (...args: any) => Promise<void> | void

    constructor(bot: ExtendedBot, v: {
        command: string,
        args?: Array<string> | null, argTypes?: Array<string | boolean | number> | null,
        func: (...args: any) => Promise<void> | void
    }) {
        this.command = v.command;
        if (v.args && v.argTypes) {
            if (v.args.length !== v.argTypes.length) {
                throw Error("args and argTypes should have same length.")
            }
            this.args = v.args
            this.argTypes = v.argTypes
        }
        this.func = v.func
    }
}


export const instructionRegistry = new Map<string, Instruction>()


export function argsMetadata() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (args: object) {
            Object.entries(args).forEach(([key, value]) => {
                console.log(key, typeof value);
                Reflect.defineMetadata(key, typeof value, originalMethod);
            });
            originalMethod.apply(this, args)
        };
        return descriptor;
    };
}


export class BaseInstruction {
    name: string;
    description: string;
    inputSchema: BaseInstructionInput

    constructor(name: string, description: string, inputSchema: BaseInstructionInput) {
        this.name = name;
        this.description = description;
        this.inputSchema = inputSchema;
    }

    @argsMetadata()
    execute(args: object) {
        throw new Error("Not Implemented");
    }

    exe(input: BaseInstructionInput) {
        throw new Error("Not Implemented");
    }
}

export interface BaseInstructionInput {
}
