import {BaseInstruction, BaseInstructionInput, instruction, Instruction} from "../instruction";
import {ExtendedBot} from "../../extension/extendedBot";
import {instructionDoc} from "../../common/decorator/instructionDoc";
import {paramMetadata} from "../../common/fieldMetadata";
import {getStopFlag} from "../../share/flags";


class QuitInstructionInput implements BaseInstructionInput {
}

@instruction
export class QuitInstruction extends BaseInstruction {
    private bot: ExtendedBot;

    constructor(bot: ExtendedBot) {
        super("quit", "立即退出游戏", QuitInstructionInput);
        this.bot = bot
    }

    async exe(_: QuitInstructionInput) {
        this.bot.quit("Instruction asked you to quit.")
    }

}