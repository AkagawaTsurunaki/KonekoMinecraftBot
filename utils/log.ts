import {bot} from "../index";

function format(message: any) {
    return `${bot.username}：${message}`
}

export function log(message?: any, show: boolean = false): void {
    if (!show) return
    console.log(format(message))
}

export function warn(message?: any, show: boolean = false): void {
    if (!show) return
    console.warn(format(message))
}

export function error(message?: any, show: boolean = false): void {
    if (!show) return
    console.error(format(message))
}

export function debug(message?: any, show: boolean = false): void {
    if (!show) return
    console.debug(format(message))
}
