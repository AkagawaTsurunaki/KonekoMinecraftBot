import {AbstractState} from "../../abstractState";
import {getLogger} from "../../../utils/logger";
import {stateDoc} from "../../../decorator/stateDoc";
import {StrictParser} from "../../../instruction/parser";
import {instructionRegistry} from "../../../instruction/instruction";
import {ExtendedBot} from "../../../extension/extendedBot";

const logger = getLogger("InstructionState")

@stateDoc({
    name: "InstructionState",
    description: "When the master chat a instruction keyword, try to execute this skill first."
})
export class InstructionState extends AbstractState {
    constructor(bot: ExtendedBot) {
        super("InstructionState", bot);
    }

    private instructionFlag = false

    getTransitionValue(): number {
        return this.instructionFlag ? 1 : 0;
    }

    onListen() {
        super.onListen();
        this.bot.on("chat", async (username, message) => {
            if (username === this.bot.option.masterName) {
                const parser = new StrictParser()
                const {command, args} = parser.parse(message)
                const ins = instructionRegistry.get(command)
                if (ins) {
                    this.instructionFlag = true
                    logger.info(`Instruction ${command} executing...`)
                    await ins.func(args)
                    logger.info(`Instruction ${command} execution finished.`)
                    this.instructionFlag = false
                }
            }
        })
    }
}