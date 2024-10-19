import {QuitInstruction} from "./impl/quitInstruction";
import {StopInstruction} from "./impl/stopInstruction";
import {SowInstruction} from "./impl/sowInstruction";
import {HarvestInstruction} from "./impl/harvestInstruction";

export class Instruction {
    command: string
    args: Array<string> | null = null
    argTypes: Array<string | boolean | number> | null = null
    func: (...args: any) => Promise<void> | void

    constructor(v: {
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

function initAllInstructions() {
    const quit = new QuitInstruction()
    const stop = new StopInstruction()
    const sow = new SowInstruction()
    const harvest = new HarvestInstruction()

    instructionRegistry.set(quit.command, quit)
    instructionRegistry.set(stop.command, stop)
    instructionRegistry.set(sow.command, sow)
    instructionRegistry.set(harvest.command, harvest)
}

initAllInstructions()
