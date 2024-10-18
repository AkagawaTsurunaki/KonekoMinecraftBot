import {AbstractState} from "../../abstractState";
import {bot} from "../../../../index";
import {masterName} from "../../../common/const";
import {getLogger} from "../../../utils/logger";
import {QuitSkill} from "../../../skills/quitSkill";
import {FarmSkill} from "../../../skills/farmSkill";

const logger = getLogger("InstructionState")

export class InstructionState extends AbstractState {
    constructor() {
        super("InstructionState", "When the master chat a instruction keyword, try to execute this skill first.");

        // Register skills
        this.instructionMap.set("exit", this.quit)
        this.instructionMap.set("stop", () => {
            this.stopFlag = true
        })
        this.instructionMap.set("sow", this.sow)
        this.instructionMap.set("harvest", this.harvest)
    }

    private instructionMap = new Map<string, () => Promise<void> | void>
    private stopFlag = false
    private shouldExecuteInstruction: string | null = null
    private shouldExecuteFunc: (() => Promise<void> | void) | undefined | null = null

    getTransitionValue(): number {
        return this.shouldExecuteFunc ? 1 : 0;
    }

    onListen() {
        super.onListen();
        bot.on("chat", (username, message, translate, jsonMsg, matches) => {
            if (username === masterName) {
                this.shouldExecuteFunc = this.instructionMap.get(message);
                if (this.shouldExecuteFunc) {
                    this.shouldExecuteInstruction = message
                }
            }
        })
    }

    async onEnter() {
        super.onEnter();
        try {
            if (this.shouldExecuteFunc) {
                await this.shouldExecuteFunc()
                this.shouldExecuteInstruction = null
                this.shouldExecuteFunc = null
            }
        } catch (e: any) {
            logger.error(e)
            bot.chat(`Can not execute the instruction ${this.shouldExecuteInstruction}, because: ${e.message}`)
        }
    }

    onExit() {
        super.onExit();
    }

    quit() {
        QuitSkill.quitGame()
    }

    async sow() {
        this.stopFlag = false;
        // Default wheat_seeds, you can try other corps.
        await FarmSkill.sow(64, "wheat_seeds", () => this.stopFlag)
    }

    async harvest() {
        this.stopFlag = false;
        await FarmSkill.harvest(64, 1000, 5, () => this.stopFlag)
    }
}