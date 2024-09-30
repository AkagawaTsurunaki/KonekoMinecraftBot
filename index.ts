import {botOption} from "./const"
import {createBot} from "mineflayer";
import {log} from "./utils/log";
import {pathfinder} from "mineflayer-pathfinder";
import {plugin as pvp} from "mineflayer-pvp";
import {KonekoFsm} from "./fsm/fsm";
// import {loader as autoeat} from "mineflayer-auto-eat"

export const bot = createBot(botOption)
bot.loadPlugin(pathfinder)
bot.loadPlugin(pvp)
// bot.loadPlugin(autoeat)

log(`登录于 ${botOption.host}:${botOption.port}`)

const konekoFsm = new KonekoFsm()

bot.on("spawn", () => {
    bot.chat(`Ciallo～(∠・ω< )⌒★`)
});

bot.on("physicsTick", () => {
    konekoFsm.update()
})