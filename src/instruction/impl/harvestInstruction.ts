import {Instruction} from "../instruction";
import {FarmSkill} from "../../skills/farmSkill";
import {instructionDoc} from "../../decorator/instructionDoc";
import {getStopFlag, setStopFlag} from "../../share/flags";

@instructionDoc({name: "Harvest Corps", description: "Ask bot to harvest."})
export class HarvestInstruction extends Instruction {
    constructor() {
        super({
            command: "harvest", func: async () => {
                setStopFlag(false)
                await FarmSkill.harvest(64, 1000, 5, () => getStopFlag())
            }
        });
    }
}