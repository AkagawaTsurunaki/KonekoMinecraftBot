import {plainToInstance} from "class-transformer";
import {getLogger} from "../util/logger";
import {BaseInstruction} from "./instruction";
import {ToolCall} from "../agent/toolCall";

const logger = getLogger("InstructionExecutor");

export class InstructionExecutor {

    instructions: Map<string, BaseInstruction>;

    constructor() {
        this.instructions = new Map<string, BaseInstruction>();
    }

    execute(toolCall: ToolCall) {
        const instruction = this.instructions.get(toolCall.name);
        if (!instruction) {
            logger.warn(`No such instruction: ${toolCall.name}`);
            return;
        }
        const instructionInput = plainToInstance(instruction.inputSchema, toolCall.args)
        instruction.exe(instructionInput);
    }
}