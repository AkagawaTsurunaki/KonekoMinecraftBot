import {BaseInstruction, BaseInstructionInput, instruction, Instruction} from "../instruction";
import {getStopFlag, setStopFlag} from "../../share/flags";
import {ExtendedBot} from "../../extension/extendedBot";
import {instructionDoc} from "../../common/decorator/instructionDoc";
import {paramMetadata} from "../../common/fieldMetadata";

@instructionDoc({name: "Harvest Corps", description: "Ask bot to harvest."})
export class HarvestInstruction extends Instruction {
    constructor(bot: ExtendedBot) {
        super(bot, {
            command: "harvest", func: async () => {
                setStopFlag(false)
                await bot.skills.farm.harvest(64, 1000, 5, () => getStopFlag())
            }
        });
    }
}

class HarvestInstructionInput implements BaseInstructionInput {
    @paramMetadata("搜索作物的半径大小", false)
    searchRadius: number = 64
    @paramMetadata("最多采集多少个作物", false)
    maxCount: number = 1000
}

@instruction
export class HarvestInstruction01 extends BaseInstruction {
    private bot: ExtendedBot;

    constructor(bot: ExtendedBot) {
        super("harvest", "收割附近的作物", HarvestInstructionInput);
        this.bot = bot
    }

    async exe(input: HarvestInstructionInput) {
        await this.bot.skills.farm.harvest(input.searchRadius, input.maxCount, 5, () => getStopFlag())
    }

}