import {bot} from "../../index";
import {Timer} from "../utils/timer";
import {myEmitter} from "./extendedBotEvents";

const timer = new Timer(20)

export function startSecondEvent() {
    bot.on("physicsTick", () => {
        timer.onPhysicsTick()
        if (timer.check()) {
            myEmitter.emit("secondTick")
            timer.reset()
        }
    })
}

