import {bot} from "../index";
import pino from "pino";
import pretty from 'pino-pretty';


function format(message: any) {
    return `${bot.username}：${message}`
}

export function log(message?: any, show: boolean = true): void {
    if (!show) return
    console.log(format(message))
}

export function warn(message?: any, show: boolean = true): void {
    if (!show) return
    console.warn(format(message))
}

export function error(message?: any, show: boolean = true): void {
    if (!show) return
    console.error(format(message))
}

export function debug(message?: any, show: boolean = false): void {
    if (!show) return
    console.debug(format(message))
}

export function getLogger(name: string) {
    const stream = pretty({
        colorize: true
    })
    return pino({name: name, level: "debug"}, stream);
}