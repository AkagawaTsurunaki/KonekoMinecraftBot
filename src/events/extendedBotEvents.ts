import {BotEvents} from "mineflayer";
import {EventEmitter} from "events";
import TypedEmitter from "typed-emitter";
import {Entity} from "prismarine-entity";
import {DamageType} from "./damageEvent";
import {ExtendedBot} from "../extension/extendedBot";

export interface ExtendedBotEvents extends BotEvents {
    secondTick: () => Promise<void> | void
    botDamageEvent: (
              sourceType: DamageType,
              sourceCause: Entity | null,
              sourceDirect: Entity | null) => Promise<void> | void
    damageEvent: (entity: Entity,
                  sourceType: DamageType,
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

export const myEmitter = new EventEmitter() as TypedEmitter<ExtendedBotEvents>