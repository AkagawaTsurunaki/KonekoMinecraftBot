import {AbstractState} from "../../abstractState";
import {bot} from "../../../../index";
import {masterName} from "../../../common/const";
import {getLogger} from "../../../utils/logger";
import {QuitSkill} from "../../../skills/quitSkill";
import {FarmSkill} from "../../../skills/farmSkill";
import {DocGenerator} from "../../../common/mermaid";

const logger = getLogger("InstructionState")

export class InstructionState extends AbstractState {
    constructor() {
        super("InstructionState", "When the master chat a instruction keyword, try to execute this skill first.");

        // Register skills
        this.instructionMap.set("quit", this.quit)
        this.instructionMap.set("stop", () => {
            this.stopFlag = true
        })
        this.instructionMap.set("sow", async () => {
            await this.sow(this.args)
        })
        this.instructionMap.set("harvest", this.harvest)

        const instructionForm = new Map<string, string>();
        instructionForm.set("quit", "Ask bot to quit from the game. Usage: `quit`")
        instructionForm.set("stop", "Ask bot to stop current instruction executing. Note that it will not shutdown the FSM. Usage: `stop`")
        instructionForm.set("sow", "Ask bot to sow. Usage: `sow <item_name>`")
        instructionForm.set("harvest", "Ask bot to sow. Usage: `harvest`")
        DocGenerator.generateInstructionForm(instructionForm)
    }

    private instructionMap = new Map<string, () => Promise<void> | void>
    private stopFlag = false
    private shouldExecuteInstruction: string | null = null
    private shouldExecuteFunc: (() => Promise<void> | void) | undefined | null = null
    private args: any

    getTransitionValue(): number {
        return this.shouldExecuteFunc ? 1 : 0;
    }

    onListen() {
        super.onListen();
        bot.on("chat", (username, message, translate, jsonMsg, matches) => {
            if (username === masterName) {
                const args = message.split(" ");
                this.shouldExecuteFunc = this.instructionMap.get(args[0]);
                if (this.shouldExecuteFunc) {
                    this.shouldExecuteInstruction = message
                    this.args = args
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
                this.args = null
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

    async sow(args: any) {
        this.stopFlag = false;
        const itemName: string = args[1] ? args[1] : "wheat_seeds"
        await FarmSkill.sow(64, itemName, () => this.stopFlag)
    }

    async harvest() {
        this.stopFlag = false;
        await FarmSkill.harvest(64, 1000, 5, () => this.stopFlag)
    }
}