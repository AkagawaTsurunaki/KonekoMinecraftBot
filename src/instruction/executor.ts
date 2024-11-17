import {plainToInstance} from "class-transformer";
import {getLogger} from "../util/logger";
import {BaseInstruction} from "./instruction";
import {ToolCall} from "../agent/toolCall";
import {ExtendedBot} from "../extension/extendedBot";
import {ChatInstruction} from "./impl/chatInstruction";

const logger = getLogger("InstructionExecutor");

export class InstructionExecutor {

    instructions: Map<string, BaseInstruction>;
    private bot: ExtendedBot;

    constructor(bot: ExtendedBot) {
        this.bot = bot
        this.instructions = new Map<string, BaseInstruction>();
        const chat = new ChatInstruction(this.bot)
        this.instructions.set(chat.name, chat)
    }

    start() {
        this.bot.events.on("instructionCall", toolCall => {
            this.execute(toolCall);
        })
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