import {botOption} from "./const"
import {createBot} from "mineflayer";
import {log} from "./utils/log";
import {pathfinder} from "mineflayer-pathfinder";
import {plugin as pvp} from "mineflayer-pvp";
import {FSM} from "./fsm/fsm";
import {IdleState} from "./fsm/idleState";
import {FollowPlayerState} from "./fsm/followPlayerState";
import {AttackHostilesState} from "./fsm/attackHostilesState";
import {Vec3} from "vec3";
import {DiveState} from "./fsm/diveState";
import {AttackPlayerState} from "./fsm/attackPlayerState";
import {ChatMessage} from "prismarine-chat";
import {SleepState} from "./fsm/sleepState";
import {Block} from "prismarine-block";
import {LoggingWithPlayerState} from "./fsm/loggingWithPlayerState";
import {Entity} from "prismarine-entity";
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
        const attackHostiles = new AttackHostilesState()
        const attackPlayerState = new AttackPlayerState()
        const diveState = new DiveState()
        const sleepState = new SleepState();
        const loggingWithPlayerState = new LoggingWithPlayerState();

        idleState.nextStates = [attackHostiles, diveState, followPlayerState, attackPlayerState, loggingWithPlayerState]
        followPlayerState.nextStates = [idleState, attackHostiles, attackPlayerState, sleepState, loggingWithPlayerState]
        sleepState.nextStates = [idleState, followPlayerState]
        attackHostiles.nextStates = [idleState, diveState, followPlayerState, loggingWithPlayerState]
        attackPlayerState.nextStates = [idleState, attackHostiles]
        diveState.nextStates = [idleState, attackHostiles]
        loggingWithPlayerState.nextStates = [idleState]
        // sleepState.nextStates = [idleState]

        this.curState = idleState

        loggingWithPlayerState.onUpdate()
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

bot.on("chat", async (
    username: string,
    message: string,
    translate: string | null,
    jsonMsg: ChatMessage,
    matches: string[] | null
) => {
})

bot.on("physicsTick", () => {
    konekoFsm.update()
})


// @ts-ignore
bot.on("blockBreakProgressEnd", (block: Block, entity: Entity) => {
    console.log(block)
    console.log(entity)
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