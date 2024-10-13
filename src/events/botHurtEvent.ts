import {bot} from "../../index";
import {myEmitter} from "./extendedBotEvents";

export function startBotDamageEvent() {
    myEmitter.on("damageEvent", (entity, sourceType, sourceCause, sourceDirect) => {
        if (entity.type === 'player' && entity.username === bot.username) {
            myEmitter.emit("botDamageEvent", sourceType, sourceCause, sourceDirect)
        }
    })
}