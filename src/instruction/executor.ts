import {plainToInstance} from "class-transformer";
import {getLogger} from "../util/logger";
import {BaseInstruction} from "./instruction";
import {ToolCall} from "../agent/toolCall";
import {ExtendedBot} from "../extension/extendedBot";
import {Container} from "../common/container";
import {InstructionRegistry} from "./registry";

const logger = getLogger("InstructionExecutor");

export class InstructionExecutor {

    private bot: ExtendedBot;
    private instructionRegistry: InstructionRegistry

    constructor(bot: ExtendedBot, instructionRegistry: Container<string, BaseInstruction>) {
        this.bot = bot;
        this.instructionRegistry = instructionRegistry;
    }

    start() {
        this.bot.events.on("instructionCall", toolCall => {
            this.execute(toolCall);
        })
        logger.info("Instructions: " + this.instructionRegistry.registry.size)
    }

    execute(toolCall: ToolCall) {
        const instruction = this.instructionRegistry.registry.get(toolCall.name)
        if (!instruction) {
            logger.warn(`No such instruction: ${toolCall.name}`);
            return;
        }
        const instructionInput = plainToInstance(instruction.inputSchema, toolCall.args)
        instruction.exe(instructionInput);
    }
}