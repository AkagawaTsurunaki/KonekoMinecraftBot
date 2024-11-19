import {BaseInstruction, BaseInstructionInput, instruction, Instruction} from "../instruction";
import {getLogger} from "../../util/logger";
import {getStopFlag, setStopFlag} from "../../share/flags";
import {ExtendedBot} from "../../extension/extendedBot";
import {instructionDoc} from "../../common/decorator/instructionDoc";

const logger = getLogger("StopInstruction")

class StopInstructionInput implements BaseInstructionInput {

}

@instruction
export class StopInstruction extends BaseInstruction {
    private bot: ExtendedBot;

    constructor(bot: ExtendedBot) {
        super("stop", "立刻停止当前的动作", StopInstructionInput);
        this.bot = bot
    }

    async exe(_: StopInstructionInput) {
        setStopFlag(true)
        logger.warn("Instruction execution stopped!")
    }
}