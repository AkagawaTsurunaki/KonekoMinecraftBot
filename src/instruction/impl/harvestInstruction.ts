import {BaseInstruction, BaseInstructionInput, instruction} from "../instruction";
import {getStopFlag} from "../../share/flags";
import {ExtendedBot} from "../../extension/extendedBot";
import {paramMetadata} from "../../common/fieldMetadata";

class HarvestInstructionInput implements BaseInstructionInput {
    @paramMetadata("搜索作物的半径大小", false)
    searchRadius: number = 64
    @paramMetadata("最多采集多少个作物", false)
    maxCount: number = 1000
}

@instruction
export class HarvestInstruction extends BaseInstruction {
    private bot: ExtendedBot;

    constructor(bot: ExtendedBot) {
        super("harvest", "收割附近的作物", HarvestInstructionInput);
        this.bot = bot
    }

    async exe(input: HarvestInstructionInput) {
        await this.bot.skills.farm.harvest(input.searchRadius, input.maxCount, 5, () => getStopFlag())
    }

}