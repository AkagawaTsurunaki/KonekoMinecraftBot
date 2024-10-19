import {instructionDoc} from "../../decorator/instructionDoc";
import {Instruction} from "../instruction";
import {getLogger} from "../../utils/logger";
import {setStopFlag} from "../../share/flags";
import {ExtendedBot} from "../../extension/extendedBot";

const logger = getLogger("StopInstruction")

@instructionDoc({
    name: "Stop",
    description: "Ask bot to stop current instruction executing. Note that it will not shutdown the FSM."
})
export class StopInstruction extends Instruction {
    constructor(bot: ExtendedBot) {
        super(bot, {
            command: "stop", func: () => {
                setStopFlag(true)
                logger.warn("Instruction execution stopped!")
            }
        });
    }
}