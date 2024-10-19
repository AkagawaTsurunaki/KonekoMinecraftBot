import {AbstractState} from "../../abstractState";
import {bot, botOption} from "../../../../index";
import {getLogger} from "../../../utils/logger";
import {stateDoc} from "../../../decorator/stateDoc";
import {StrictParser} from "../../../instruction/parser";
import {instructionRegistry} from "../../../instruction/instruction";

const logger = getLogger("InstructionState")

@stateDoc({
    name: "InstructionState",
    description: "When the master chat a instruction keyword, try to execute this skill first."
})
export class InstructionState extends AbstractState {
    constructor() {
        super("InstructionState");
    }

    private instructionFlag = false

    getTransitionValue(): number {
        return this.instructionFlag ? 1 : 0;
    }

    onListen() {
        super.onListen();
        bot.on("chat", async (username, message, translate, jsonMsg, matches) => {
            if (username === botOption.masterName) {
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