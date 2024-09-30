import {botOption} from "./const"
import {createBot} from "mineflayer";
import {log} from "./utils/log";
import {pathfinder} from "mineflayer-pathfinder";
import {plugin as pvp} from "mineflayer-pvp";
import {FSM} from "./fsm/fsm";
import {IdleState} from "./fsm/idleState";
import {FollowPlayerState} from "./fsm/followPlayerState";
import {AttackHostileState} from "./fsm/attackHostileState";
// import {loader as autoeat} from "mineflayer-auto-eat"

export const bot = createBot(botOption)
bot.loadPlugin(pathfinder)
bot.loadPlugin(pvp)
// bot.loadPlugin(autoeat)

log(`登录于 ${botOption.host}:${botOption.port}`)
export class KonekoFsm extends FSM {
    public update() {
        try {
            if (this.curState.cond()) {
                this.curState.takeAction()
            } else {
                for (let nextState of this.curState.nextStates) {
                    this.curState = nextState
                }
            }
        } catch (e) {
            // 如果出现 TypeError: curState.nextStates is not iterable，请检查您的状态机环路是否存在 null 节点。
            throw e
        }

        log(`FSM 当前：${this.curState.name}`)
    }

    protected register() {
        // 状态机注册
        const idleState = new IdleState()
        const followPlayerState = new FollowPlayerState()
        const attackHostile = new AttackHostileState()

        idleState.nextStates = [followPlayerState, attackHostile]
        followPlayerState.nextStates = [idleState]
        attackHostile.nextStates = [followPlayerState]

        this.curState = idleState
    }

}

const konekoFsm = new KonekoFsm()

bot.on("spawn", () => {
    bot.chat(`Ciallo～(∠・ω< )⌒★`)
});

bot.on("physicsTick", () => {
    konekoFsm.update()
})