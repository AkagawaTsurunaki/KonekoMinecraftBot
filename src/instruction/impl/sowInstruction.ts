import {BaseInstruction, BaseInstructionInput, instruction} from "../instruction";
import {getStopFlag} from "../../share/flags";
import {ExtendedBot} from "../../extension/extendedBot";
import {paramMetadata} from "../../common/fieldMetadata";
import {corpsNameList} from "../../common/const";


class SowInstructionInput implements BaseInstructionInput {
    @paramMetadata(`作物名称： ${corpsNameList}`, true)
    itemName: string = ""
}

@instruction
export class SowInstruction extends BaseInstruction {
    private bot: ExtendedBot;

    constructor(bot: ExtendedBot) {
        super("sow", "在附近种植作物", SowInstructionInput);
        this.bot = bot
    }

    async exe(input: SowInstructionInput) {
        await this.bot.skills.farm.sow(64, input.itemName, () => getStopFlag())
    }
}