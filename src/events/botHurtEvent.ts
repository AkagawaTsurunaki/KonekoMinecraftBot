import {bot} from "../../index";
import {ExtendedEventEmitter, myEmitter} from "./extendedBotEvents";

export class BotHurtEventEmitter extends ExtendedEventEmitter {

    startEventEmitter(): void {
        myEmitter.on("damageEvent", (entity, sourceType, sourceCause, sourceDirect) => {
            if (entity.type === 'player' && entity.username === bot.username) {
                myEmitter.emit("botDamageEvent", sourceType, sourceCause, sourceDirect)
            }
        })
    }
}

