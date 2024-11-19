import {getLogger} from "../util/logger";
import {BaseInstruction, BaseInstructionInput} from "../instruction/instruction";
import {getFieldMetadata} from "./fieldMetadata";

const logger = getLogger("docGen.ts");


function genForm(title: string[], rows: string[][]) {
    const titleRow = "| " + title.join(" | ") + " |"
    const content = rows.map(row => "| " + row.join(" | ") + " |").join("\n");;
    return titleRow + "\n" + content;
}

function inputSchemaToString(input: BaseInstructionInput) {
    const fieldMetadata = getFieldMetadata(input);
    const s = fieldMetadata.map(value => {
        return value.required ? `<${value.name}>` : `[${value.name}]`;
    })
    return s.join(" ")
}

export function genInstructions(instructions: BaseInstruction[]) {
    const title = ["Name", "Usage", "Description"];
    const rows = instructions.map(instruction => {
        const usage = instruction.name + " " + inputSchemaToString(instruction.inputSchema);
        return [instruction.name, usage, instruction.description]
    })
    return genForm(title, rows)
}