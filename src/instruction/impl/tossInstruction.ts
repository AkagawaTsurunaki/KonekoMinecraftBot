import {Instruction} from "../instruction";
import {getLogger} from "../../util/logger";
import {ExtendedBot} from "../../extension/extendedBot";
import {instructionDoc} from "../../common/decorator/instructionDoc";

const logger = getLogger("TossInstruction")

@instructionDoc({
    name: "Toss Items",
    description: "Ask bot to toss specific amount of items from its inventory."
})
export class TossInstruction extends Instruction {
    constructor(bot: ExtendedBot) {
        super(bot, {
            command: "toss", func: async (itemName: string, amount: number) => {
                await bot.skills.toss.tossItem(itemName, amount)
            }, args: ["itemName", "amount"], argTypes: ["string", "number"]
        });
    }
}