import {botOption} from "./const"
import {createBot} from "mineflayer";
import {log} from "./utils/log";

export const bot = createBot(botOption)

log(`登录于 ${botOption.host}:${botOption.port}`)

bot.on("spawn", () => {
    bot.chat(`Ciallo～(∠・ω< )⌒★`)
})