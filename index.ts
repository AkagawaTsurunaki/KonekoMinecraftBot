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
import {AttackPlayerState} from "./fsm/attackPlayerState";
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
        const attackPlayerState = new AttackPlayerState()

        idleState.nextStates = [followPlayerState, attackHostile, attackPlayerState]
        followPlayerState.nextStates = [idleState]
        attackHostile.nextStates = [followPlayerState]
        attackPlayerState.nextStates = [idleState]

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

bot.on("hardcodedSoundEffectHeard", async (soundId: number,
                                     soundCategory: string | number,
                                     position: Vec3,
                                     volume: number,
                                     pitch: number) => {
    if (soundCategory === "player" || soundCategory === "hostile" || soundCategory === "mob") {
        await bot.lookAt(position)
    }
})