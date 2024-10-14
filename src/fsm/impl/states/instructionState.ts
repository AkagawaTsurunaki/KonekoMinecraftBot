import {AbstractState} from "../../abstractState";
import {bot} from "../../../../index";
import {masterName} from "../../../common/const";
import {getLogger} from "../../../utils/logger";
import {QuitSkill} from "../../../skills/quitSkill";

const logger = getLogger("InstructionState")

export class InstructionState extends AbstractState {
    constructor() {
        super("InstructionState");
        this.instructionMap.set("退出", this.quit)
    }

    private instructionMap = new Map<string, () => Promise<void> | void>
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
            if (this.shouldExecuteFunc){
                await this.shouldExecuteFunc()
                this.shouldExecuteInstruction = null
                this.shouldExecuteFunc = null
            }
        } catch (e: any) {
            logger.error(e)
            bot.chat(`无法执行指令 ${this.shouldExecuteInstruction}，因为：${e.message}`)
        }
    }

    onExit() {
        super.onExit();
    }

    quit() {
        QuitSkill.quitGame()
    }
}