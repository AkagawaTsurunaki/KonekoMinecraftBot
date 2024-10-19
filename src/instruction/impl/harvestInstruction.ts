import {Instruction} from "../instruction";
import {instructionDoc} from "../../decorator/instructionDoc";
import {getStopFlag, setStopFlag} from "../../share/flags";
import { ExtendedBot } from "../../extension/extendedBot";

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