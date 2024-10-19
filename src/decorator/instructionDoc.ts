import {InstructionDocument} from "../document/instructionDocument";
import {DocumentManager} from "../document/documentManager";

export function instructionDoc(info: { name: string, description: string, usage?: string }) {
    return (constructor: Function) => {
        const instruction: any = constructor()
        if (instruction.args && instruction.argTypes) {
            for (let i = 0; i < instruction.args.length; i++) {
                const usage = " <" + instruction.args[i] + ":" + instruction.argTypes + "> "
                const instructionDocument = new InstructionDocument(info.name, info.description, usage);
                DocumentManager.addInstructionDoc(instructionDocument)
            }
        }
        return instruction
    }
}