import {botOption} from "./const"
import {createBot} from "mineflayer";
import {log} from "./utils/log";
import {State} from "./fsm/fsm";
import {Follow} from "./skills/follow";
import {pathfinder} from "mineflayer-pathfinder";
import {plugin as pvp} from "mineflayer-pvp";
// import {loader as autoeat} from "mineflayer-auto-eat"

export const bot = createBot(botOption)
bot.loadPlugin(pathfinder)
bot.loadPlugin(pvp)
// bot.loadPlugin(autoeat)

log(`登录于 ${botOption.host}:${botOption.port}`)

class FollowState extends State {

    public name = "跟随状态"
    private minDistance = 10

    cond(): boolean {
        const player = Follow.findNearestPlayer(0, 64)
        if (player) {
            const dist = player.position.distanceTo(bot.entity.position)
            return dist > this.minDistance
        }
        return true
    }

    takeAction() {
        Follow.followNearestPlayer(this.minDistance, true).then(
            () => log(`跟随最近玩家完成`)
        )
    }

    updateEnv(env: any) {

    }

}

class IdleState extends State {

    public name = "主状态"

    cond() {
        return false
    }

    takeAction() {
    }

    updateEnv(env: any) {
    }
}

bot.on("spawn", () => {
    bot.chat(`Ciallo～(∠・ω< )⌒★`)
});

// 状态机注册
const idleState = new IdleState()
const followState = new FollowState()
idleState.nextStates = [followState]
followState.nextStates = [idleState]

let curState = idleState

bot.on("physicsTick", () => {
    try {
        if (curState.cond()) {
            curState.takeAction()
        } else {
            for (let nextState of curState.nextStates) {
                curState = nextState
            }
        }
    } catch (e) {
        log(`如果出现 TypeError: curState.nextStates is not iterable，请检查您的状态机环路是否存在 null 节点。`)
        throw e
    }

    log(`FSM 当前：${curState.name}`)
})