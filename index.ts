import {createBot} from "mineflayer";
import {pathfinder} from "mineflayer-pathfinder";
import {plugin as pvp} from "mineflayer-pvp";
import {Vec3} from "vec3";
import {getLogger} from "./src/utils/log";
import {botOption, masterName} from "./src/common/const";
import {startSecondEvent} from "./src/events/secondEvent";
import {CustomFsm} from "./src/newFsm/customFsm";
import {MermaidGenerator} from "./src/common/mermaid";


const logger = getLogger("index")
export const bot = createBot(botOption)

// 加载插件
bot.loadPlugin(pathfinder)
bot.loadPlugin(pvp)

logger.info(`Login at ${botOption.host}:${botOption.port}`)

// 启动自定义事件发射器
startSecondEvent()

logger.info(`Finite state machine initializing...`)
const newFsm = new CustomFsm()

bot.on("spawn", () => {
    bot.chat(`Koneko 正在测试中……`)
    newFsm.init()
    newFsm.start()
    logger.info(`Finite state machine started.`)
    new MermaidGenerator().generate(newFsm)
});


bot.on("chat", async (username, message, translate, jsonMsg) => {
    if (username === masterName && message === "quit") {
        bot.quit(`${masterName} asked you to quit.`)
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