import {ExtendedEventEmitter} from "./extendedEventEmitter";

export class BotHurtEventEmitter extends ExtendedEventEmitter {

    startEventEmitter(): void {
        this.bot.events.on("damageEvent", (entity, sourceType, sourceCause, sourceDirect) => {
            if (entity.type === 'player' && entity.username === this.bot.username) {
                this.bot.events.emit("botDamageEvent", sourceType, sourceCause, sourceDirect)
            }
        })
    }
}