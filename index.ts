import {createBot} from "mineflayer";
import {pathfinder} from "mineflayer-pathfinder";
import {plugin as pvp} from "mineflayer-pvp";
import {Vec3} from "vec3";
import {getLogger} from "./src/utils/log";
import {botOption, masterName} from "./src/common/const";
import {startSecondEvent} from "./src/events/secondEvent";
import {CustomFSM} from "./src/newFsm/impl/customFSM";


const logger = getLogger("index")
export const bot = createBot(botOption)

// 加载插件
bot.loadPlugin(pathfinder)
bot.loadPlugin(pvp)

logger.info(`Login at ${botOption.host}:${botOption.port}`)

// 启动自定义事件发射器
startSecondEvent()

logger.info(`Finite state machine initializing...`)
const fsm = new CustomFSM()

bot.on("spawn", () => {
    bot.chat(`Koneko 正在测试中……`)
    fsm.init()
    fsm.start()
    logger.info(`Finite state machine started.`)
    // new MermaidGenerator().generate(newFsm)
});


bot.on("chat", async (username, message, translate, jsonMsg) => {
    if (username === masterName && message === "quit") {
        bot.quit(`${masterName} asked you to quit.`)
    } else if (username === masterName && message === "test") {
        // const vec3s = bot.findBlocks({
        //     point: bot.entity.position,
        //     maxDistance: 3,
        //     count: 5,
        //     matching: block => block.skyLight < 10}
        // );
        // logger.debug(vec3s)
        // const blockAt = bot.blockAt(bot.entity.position.offset(0, -1, 0));
        // if (!blockAt) {
        //     logger.debug("null")
        //     return
        // }
        // logger.debug([blockAt.light, blockAt.skyLight])
        // bot.findBlocks({point: bot.entity.position, maxDistance: 16, count: 2000, matching: block => block.skyLight <= 10}).forEach(
        //     block => {
        //         const cmd = `/setblock ${block.x} ${block.y} ${block.z} minecraft:white_wool`;
        //         bot.chat(cmd)
        //     }
        // )
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