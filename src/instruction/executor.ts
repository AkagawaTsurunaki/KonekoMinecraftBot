import {plainToInstance} from "class-transformer";
import {getLogger} from "../util/logger";
import {BaseInstruction} from "./instruction";
import {ToolCall} from "../agent/toolCall";
import {ExtendedBot} from "../extension/extendedBot";
import {Container, instructionContainer} from "../common/container";

const logger = getLogger("InstructionExecutor");

export class InstructionExecutor {

    private bot: ExtendedBot;
    private instructionContainer: Container<string, BaseInstruction>

    constructor(bot: ExtendedBot, instructionContainer: Container<string, BaseInstruction>) {
        this.bot = bot;
        this.instructionContainer = instructionContainer;
    }

    start() {
        this.bot.events.on("instructionCall", toolCall => {
            this.execute(toolCall);
        })
        logger.info("Instructions: " + instructionContainer.registry.size)
    }

    execute(toolCall: ToolCall) {
        const instruction = this.instructionContainer.registry.get(toolCall.name)
        if (!instruction) {
            logger.warn(`No such instruction: ${toolCall.name}`);
            return;
        }
        const instructionInput = plainToInstance(instruction.inputSchema, toolCall.args)
        instruction.exe(instructionInput);
    }
}