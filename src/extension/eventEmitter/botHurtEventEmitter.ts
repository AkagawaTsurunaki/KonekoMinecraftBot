import {ExtendedEventEmitter, myEmitter} from "./extendedEventEmitter";

export class BotHurtEventEmitter extends ExtendedEventEmitter {

    startEventEmitter(): void {
        myEmitter.on("damageEvent", (entity, sourceType, sourceCause, sourceDirect) => {
            if (entity.type === 'player' && entity.username === this.bot.username) {
                myEmitter.emit("botDamageEvent", sourceType, sourceCause, sourceDirect)
            }
        })
    }
}