import {BotEvents} from "mineflayer";
import {EventEmitter} from "events";
import TypedEmitter from "typed-emitter";
import {Entity} from "prismarine-entity";
import {DamageType} from "./damageEvent";

export interface ExtendedBotEvents extends BotEvents {
    secondTick: () => Promise<void> | void
    botDamageEvent: (botEntity: Entity,
              sourceType: DamageType,
              sourceCause: Entity | null,
              sourceDirect: Entity | null) => Promise<void> | void
    damageEvent: (entity: Entity,
                  sourceType: DamageType,
                  sourceCause: Entity | null,
                  sourceDirect: Entity | null) => Promise<void> | void
}

export const myEmitter = new EventEmitter() as TypedEmitter<ExtendedBotEvents>