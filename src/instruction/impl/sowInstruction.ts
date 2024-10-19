import {Instruction} from "../instruction";
import {instructionDoc} from "../../decorator/instructionDoc";
import {getStopFlag, setStopFlag} from "../../share/flags";
import {ExtendedBot} from "../../extension/extendedBot";

@instructionDoc({name: "Sow Corps", description: "Ask bot to sow."})
export class SowInstruction extends Instruction {
    constructor(bot: ExtendedBot) {
        super(bot, {
            command: "sow", args: ["itemName"], argTypes: ["string"], func: async (itemName: string) => {
                setStopFlag(false)
                await bot.skills.farm.sow(64, itemName, () => getStopFlag())
            }
        });

    }

}