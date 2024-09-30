import {bot} from "../index";


export function log(message?: any): void {
    message = `${bot.username}：${message}`
    console.log(message)
}