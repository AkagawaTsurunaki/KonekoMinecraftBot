import {bot} from "./index";

export const botOption = {
    host: "127.0.0.1", // 主机地址
    port: 25565, // 端口地址
    username: "Koneko",
    version: "1.20.1"
}

export const masterName: string = "Akagawa"


export const axeTypeList: number[] = [
    bot.registry.itemsByName['diamond_axe'].id,
    bot.registry.itemsByName['iron_axe'].id,
    bot.registry.itemsByName['stone_axe'].id,
    bot.registry.itemsByName['wooden_axe'].id,
    bot.registry.itemsByName['golden_axe'].id,
    bot.registry.itemsByName['netherite_axe'].id
]