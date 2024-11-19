import {ExtendedBot} from "../extension/extendedBot";
import 'reflect-metadata';
import * as console from "node:console";
import {ClassConstructor} from "class-transformer";
import {getLogger} from "../util/logger";

const logger = getLogger("Instruction");

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

type ExampleConstructor = new () => BaseInstructionInput;

export abstract class BaseInstruction {
    name: string;
    description: string;
    inputSchema: ExampleConstructor

    constructor(name: string, description: string, inputSchema: ExampleConstructor) {
        this.name = name;
        this.description = description;
        this.inputSchema = inputSchema;
    }

    @argsMetadata()
    execute(args: object) {
        throw new Error("Not Implemented");
    }

    abstract exe(input: BaseInstructionInput): void | Promise<void>;
}

export interface BaseInstructionInput {
}

export function instruction(cls: ClassConstructor<BaseInstruction>) {
    Reflect.defineMetadata("instruction:class", cls.name, cls);
    logger.info(`Instruction registered: ${cls.name}`)
}
