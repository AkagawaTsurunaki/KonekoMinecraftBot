import {ExtendedEventEmitter} from "./extendedEventEmitter";
import {Timer} from "../../util/timer";

export class SecondEventEmitter extends ExtendedEventEmitter {
    private readonly timer = new Timer(20)

    startEventEmitter(): void {
        this.bot.on("physicsTick", () => {
            this.timer.onPhysicsTick()
            if (this.timer.check()) {
                this.bot.events.emit("secondTick")
                this.timer.reset()
            }
        })
    }

}