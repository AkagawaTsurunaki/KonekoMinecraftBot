import {createBot} from "mineflayer";
import {pathfinder} from "mineflayer-pathfinder";
import {plugin as pvp} from "mineflayer-pvp";
import {Vec3} from "vec3";
import {getLogger} from "./src/utils/logger";
import {botOption, masterName} from "./src/common/const";
import {startSecondEvent} from "./src/events/secondEvent";
import {DamageType, startDamageEvent} from "./src/events/damageEvent";
import {myEmitter} from "./src/events/extendedBotEvents";
import {Entity} from "prismarine-entity";
import { startBotDamageEvent } from "./src/events/botHurtEvent";


const logger = getLogger("index")
export const bot = createBot(botOption)

// 加载插件
bot.loadPlugin(pathfinder)
bot.loadPlugin(pvp)

logger.info(`Login at ${botOption.host}:${botOption.port}`)

// 启动自定义事件发射器
startSecondEvent()
startDamageEvent()
startBotDamageEvent()

logger.info(`Finite state machine initializing...`)
// const fsm = new CustomFSM()

bot.on("spawn", () => {
    bot.chat(`Koneko 正在测试中……`)
    // fsm.init()
    // fsm.start()
    logger.info(`Finite state machine started.`)
    // new MermaidGenerator().generate(newFsm)
});


bot.on("chat", async (username, message, translate, jsonMsg) => {
    if (username === masterName && message === "quit") {
        bot.quit(`${masterName} asked you to quit.`)
    } else if (username === masterName && message === "test") {

    }
})

myEmitter.on("botDamageEvent", (botEntity: Entity,
                             sourceType: DamageType,
                             sourceCause: Entity | null,
                             sourceDirect: Entity | null) => {
    console.log(`${botEntity.username} got ${sourceType.name} damage by ${sourceDirect?.name} from ${sourceCause?.name}.`)
    if (sourceType.name === "arrow") {
        bot.chat("Ouch... Take care of your bow and arrows!!!")
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