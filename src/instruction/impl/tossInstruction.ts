import {BaseInstruction, BaseInstructionInput, instruction} from "../instruction";
import {getLogger} from "../../util/logger";
import {ExtendedBot} from "../../extension/extendedBot";
import {paramMetadata} from "../../common/fieldMetadata";

const logger = getLogger("TossInstruction")


class TossInstructionInput implements BaseInstructionInput {
    @paramMetadata("扔出的物品名称", true)
    itemName: string = ""
    @paramMetadata("扔出的物品数量", true)
    amount: number = 0
}

@instruction
export class TossInstruction extends BaseInstruction {
    private bot: ExtendedBot;

    constructor(bot: ExtendedBot) {
        super("toss", "丢出背包或手中的物品", TossInstructionInput);
        this.bot = bot
    }

    async exe(input: TossInstructionInput) {
        await this.bot.skills.toss.tossItem(input.itemName, input.amount)
        logger.info("Tossed items.")
    }
}