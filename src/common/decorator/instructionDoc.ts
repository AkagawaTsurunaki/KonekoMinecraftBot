import {DocumentManager} from "../doc/documentManager";
import {InstructionDocument} from "../doc/instructionDocument";
import {Instruction} from "../../instruction/instruction";

export function instructionDoc(info: { name: string, description: string, usage?: string }) {
    return function <T extends new (...args: any[]) => any>(constructor: T) {
        const instruction: Instruction = new constructor()
        let usage = instruction.command
        if (instruction.args && instruction.argTypes) {
            for (let i = 0; i < instruction.args.length; i++) {
                usage += " \\<" + instruction.args[i] + ":" + instruction.argTypes + "\\> "
            }
        }
        const instructionDocument = new InstructionDocument(info.name, info.description, usage);
        DocumentManager.addInstructionDoc(instructionDocument)
    }
}