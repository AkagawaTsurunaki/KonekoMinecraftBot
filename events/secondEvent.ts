import {bot} from "../index";
import {BotEvents} from "mineflayer";
import {EventEmitter} from 'events';
import TypedEmitter from 'typed-emitter'
import {Timer} from "../utils/timer";

const timer = new Timer(20)

bot.on("physicsTick", () => {
    timer.onPhysicsTick()
    if (timer.check()) {
        myEmitter.emit("secondTick")
        timer.reset()
    }
})

interface ExtendedBotEvents extends BotEvents {
    secondTick: () => Promise<void> | void
}


const myEmitter = new EventEmitter() as TypedEmitter<ExtendedBotEvents>

myEmitter.on("secondTick", () => {
    bot.chat("1 sec")
})