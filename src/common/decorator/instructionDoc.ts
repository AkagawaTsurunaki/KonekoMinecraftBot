import {DocumentManager} from "../doc/documentManager";
import {InstructionDocument} from "../doc/instructionDocument";
import {Instruction} from "../../instruction/instruction";

export function instructionDoc(info: { name: string, description: string, usage?: string }) {
    return function <T extends new (...args: any[]) => any>(constructor: T) {
        const instruction: Instruction = new constructor()
        if (instruction.args && instruction.argTypes) {
            let usage = instruction.command
            for (let i = 0; i < instruction.args.length; i++) {
                usage += " <" + instruction.args[i] + ":" + instruction.argTypes + "> "
            }
            const instructionDocument = new InstructionDocument(info.name, info.description, usage);
            DocumentManager.addInstructionDoc(instructionDocument)
        } else {
            const instructionDocument = new InstructionDocument(info.name, info.description, instruction.command);
            DocumentManager.addInstructionDoc(instructionDocument)
        }
    }
}