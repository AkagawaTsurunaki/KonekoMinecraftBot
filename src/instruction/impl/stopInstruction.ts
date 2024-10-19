import {instructionDoc} from "../../decorator/instructionDoc";
import {Instruction} from "../instruction";
import {getLogger} from "../../utils/logger";
import {setStopFlag} from "../../share/flags";

const logger = getLogger("StopInstruction")

@instructionDoc({
    name: "Stop",
    description: "Ask bot to stop current instruction executing. Note that it will not shutdown the FSM."
})
export class StopInstruction extends Instruction {
    constructor() {
        super({
            command: "stop", func: () => {
                setStopFlag(true)
                logger.warn("Instruction execution stopped!")
            }
        });
    }
}