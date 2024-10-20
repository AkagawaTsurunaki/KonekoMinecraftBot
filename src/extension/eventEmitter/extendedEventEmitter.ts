import {BotEvents} from "mineflayer";
import {DamageEventEmitter} from "./damageEventEmitter";
import {Entity} from "prismarine-entity";
import {ExtendedBot} from "../extendedBot";

export interface ExtendedBotEvents extends BotEvents {
    secondTick: () => Promise<void> | void
    botDamageEvent: (
        sourceType: DamageEventEmitter,
        sourceCause: Entity | null,
        sourceDirect: Entity | null) => Promise<void> | void
    damageEvent: (entity: Entity,
                  sourceType: DamageEventEmitter,
                  sourceCause: Entity | null,
                  sourceDirect: Entity | null) => Promise<void> | void
}

export abstract class ExtendedEventEmitter {
    protected bot: ExtendedBot

    public constructor(bot: ExtendedBot) {
        this.bot = bot
    }

    public abstract startEventEmitter(): void
}
