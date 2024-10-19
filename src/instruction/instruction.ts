import {QuitInstruction} from "./impl/quitInstruction";
import {StopInstruction} from "./impl/stopInstruction";
import {SowInstruction} from "./impl/sowInstruction";
import {HarvestInstruction} from "./impl/harvestInstruction";
import {ExtendedBot} from "../extension/extendedBot";

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




