import {bot} from "../index";


export function log(message?: any, show: boolean = false): void {
    if (!show) return
    message = `${bot.username}：${message}`
    console.log(message)
}