import pino from "pino";
import pretty from 'pino-pretty';


export function getLogger(name: string) {
    const stream = pretty({
        colorize: true
    })
    return pino({name: name, level: "debug"}, stream);
}
