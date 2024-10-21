import {BotEvents} from "mineflayer";
import {DamageEvent} from "./damageEventEmitter";
import {Entity} from "prismarine-entity";
import {ExtendedBot} from "../extendedBot";
import {ChatMessage} from "prismarine-chat";

export interface ExtendedBotEvents extends BotEvents {
    secondTick: () => Promise<void> | void
    botDamageEvent: (
        sourceType: DamageEvent,
        sourceCause: Entity | null,
        sourceDirect: Entity | null) => Promise<void> | void
    damageEvent: (entity: Entity,
                  sourceType: DamageEvent,
                  sourceCause: Entity | null,
                  sourceDirect: Entity | null) => Promise<void> | void
    masterPlainChat: (
        username: string,
        message: string,
        translate: string | null,
        jsonMsg: ChatMessage,
        matches: string[] | null
    ) => Promise<void> | void
}

export abstract class ExtendedEventEmitter {
    protected bot: ExtendedBot

    public constructor(bot: ExtendedBot) {
        this.bot = bot
    }

    public abstract startEventEmitter(): void
}
