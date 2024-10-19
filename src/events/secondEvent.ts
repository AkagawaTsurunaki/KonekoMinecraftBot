import {Timer} from "../utils/timer";
import {ExtendedEventEmitter, myEmitter} from "./extendedBotEvents";


export class SecondEventEmitter extends ExtendedEventEmitter {
    private readonly timer = new Timer(20)

    startEventEmitter(): void {
        this.bot.on("physicsTick", () => {
            this.timer.onPhysicsTick()
            if (this.timer.check()) {
                myEmitter.emit("secondTick")
                this.timer.reset()
            }
        })
    }

}