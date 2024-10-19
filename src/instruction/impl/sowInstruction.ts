import {Instruction} from "../instruction";
import {FarmSkill} from "../../skills/farmSkill";
import {instructionDoc} from "../../decorator/instructionDoc";
import {getStopFlag, setStopFlag} from "../../share/flags";

@instructionDoc({name: "Sow Corps", description: "Ask bot to sow."})
export class SowInstruction extends Instruction {
    constructor() {
        super({
            command: "sow", args: ["itemName"], argTypes: ["string"], func: async (itemName: string) => {
                setStopFlag(false)
                await FarmSkill.sow(64, itemName, () => getStopFlag())
            }
        });

    }

}