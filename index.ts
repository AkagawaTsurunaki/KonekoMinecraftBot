import {botOption, masterName} from "./const"
import {createBot} from "mineflayer";
import {log} from "./utils/log";
import {pathfinder} from "mineflayer-pathfinder";
import {plugin as pvp} from "mineflayer-pvp";
import {IdleState} from "./fsm/idleState";
import {Vec3} from "vec3";
import {startSecondEvent} from "./events/secondEvent";
import {CustomFsm} from "./newFsm/customFsm";
import {MermaidGenerator} from "./common/mermaid";

export const bot = createBot(botOption)


bot.loadPlugin(pathfinder)
bot.loadPlugin(pvp)

log(`登录于 ${botOption.host}:${botOption.port}`)
const idleState = new IdleState()

// export class KonekoFsm extends FSM {
//
//     public init() {
//         // 状态机注册
//         const followPlayerState = new FollowPlayerState()
//         const attackHostiles = new AttackHostilesState()
//         const attackPlayerState = new AttackPlayerState()
//         const diveState = new DiveState()
//         const sleepState = new SleepState();
//         const loggingWithPlayerState = new LoggingWithPlayerState();
//         const harvestState = new HarvestState();
//
//         idleState.nextStates = [attackHostiles, followPlayerState, attackHostiles, attackPlayerState, sleepState, loggingWithPlayerState,
//             harvestState]
//         followPlayerState.nextStates = [idleState, attackHostiles]
//         sleepState.nextStates = [idleState, followPlayerState]
//         attackHostiles.nextStates = [idleState, diveState, followPlayerState, loggingWithPlayerState]
//         attackPlayerState.nextStates = [idleState, attackHostiles]
//         diveState.nextStates = [idleState, attackHostiles]
//         loggingWithPlayerState.nextStates = [idleState]
//         harvestState.nextStates = [idleState]
//
//         this.curState = idleState
//
//         loggingWithPlayerState.onUpdate()
//     }
//
//     private timer = new Timer(20)
//
//     public start() {
//         bot.on("physicsTick", () => {
//             this.timer.onPhysicsTick()
//             if (this.timer.check()) {
//                 this.update()
//             }
//         })
//     }
//
//     private getMaxCondValState() {
//         let maxCondVal = this.curState.getCondVal()
//         log(`--> ${this.curState.name}（${maxCondVal}）<--`, true)
//         let result = null
//         let msg = ""
//         for (let nextState of this.curState.nextStates) {
//             const condVal = nextState.getCondVal();
//             msg += `${nextState.name}（${condVal}）`
//             if (condVal > maxCondVal) {
//                 maxCondVal = condVal
//                 result = nextState
//             }
//         }
//         log(msg, true)
//         return result
//     }
//
//     update() {
//         try {
//             const nextState = this.getMaxCondValState()
//             if (nextState) {
//                 this.curState.onExit()
//                 this.curState = nextState
//             }
//             this.curState.onEnter()
//         } catch (e) {
//             console.error("状态机崩溃。")
//             bot.chat(`${bot.username} 因状态机崩溃而停止运行，请联系 ${masterName} 进行重启。`)
//             throw e
//         }
//     }
// }

// const konekoFsm = new KonekoFsm()

startSecondEvent()

const newFsm = new CustomFsm()

bot.on("spawn", () => {
    bot.chat(`Koneko 正在测试中……`)
    // konekoFsm.init()
    // konekoFsm.start()
    newFsm.init()
    newFsm.start()
    new MermaidGenerator().generate(newFsm)
});


bot.on("chat", async (username, message, translate, jsonMsg) => {
    if (username === masterName && message === "rm") {
    }
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