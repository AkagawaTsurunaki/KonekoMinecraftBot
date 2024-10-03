import {botOption} from "./const"
import {createBot} from "mineflayer";
import {log} from "./utils/log";
import {pathfinder} from "mineflayer-pathfinder";
import {plugin as pvp} from "mineflayer-pvp";
import {FSM} from "./fsm/fsm";
import {IdleState} from "./fsm/idleState";
import {FollowPlayerState} from "./fsm/followPlayerState";
import {AttackHostileState} from "./fsm/attackHostileState";
import {Vec3} from "vec3";
import {DiveState} from "./fsm/diveState";
// import {loader as autoeat} from "mineflayer-auto-eat"

export const bot = createBot(botOption)
bot.loadPlugin(pathfinder)
bot.loadPlugin(pvp)
// bot.loadPlugin(autoeat)

log(`登录于 ${botOption.host}:${botOption.port}`)

export class KonekoFsm extends FSM {
    protected register() {
        // 状态机注册
        const idleState = new IdleState()
        const followPlayerState = new FollowPlayerState()
        const attackHostile = new AttackHostileState()
        // const attackPlayerState = new AttackPlayerState()
        const diveState = new DiveState()

        // idleState.nextStates = [followPlayerState, attackHostile, attackPlayerState, diveState]
        idleState.nextStates = [attackHostile, diveState, followPlayerState]
        followPlayerState.nextStates = [idleState, attackHostile]
        attackHostile.nextStates = [idleState, diveState]
        // attackPlayerState.nextStates = [idleState]
        diveState.nextStates = [idleState, attackHostile]

        this.curState = idleState
    }

    private getMaxCondValState() {
        let maxCondVal = this.curState.getCondVal()
        log(`--> ${this.curState.name}（${maxCondVal}）<--`, true)
        let result = null
        let msg = ""
        for (let nextState of this.curState.nextStates) {
            const condVal = nextState.getCondVal();
            msg += `${nextState.name}（${condVal}）`
            if (condVal > maxCondVal) {
                maxCondVal = condVal
                result = nextState
            }
        }
        log(msg, true)
        return result
    }

    update() {
        try {
            const nextState = this.getMaxCondValState()
            if (nextState) {
                this.curState.onExited()
                this.curState = nextState
            }
            this.curState.onEntered()
        } catch (e) {
            console.error("状态机崩溃。")
            throw e
        }
    }
}

const konekoFsm = new KonekoFsm()

bot.on("spawn", () => {
    bot.chat(`Koneko 正在测试中……`)
});

bot.on("physicsTick", () => {
    konekoFsm.update()
})

bot.on("hardcodedSoundEffectHeard", async (soundId: number,
                                           soundCategory: string | number,
                                           position: Vec3,
                                           volume: number,
                                           pitch: number) => {
    if (soundCategory === "player" || soundCategory === "hostile" || soundCategory === "mob") {
        await bot.lookAt(position)
    }
})