import {Entity} from "prismarine-entity";
import {getLogger} from "../utils/logger";
import {Bot, createBot} from "mineflayer";
import {AttackSkill} from "../skills/attackSkill";

const logger = getLogger("isEntityOnFire")

/**
 * Is the entity on fire.
 * @param entity The entity to check.
 */
function isEntityOnFire(entity: Entity): boolean {
    const isOnFire = entity.metadata[0] as unknown as number;
    if (isOnFire) {
        return isOnFire === 1
    }
    return false
}

/**
 * Set the entity metadata whether it is on fire.
 * @param entity The entity to set metadata `isOnFire`.
 * @param isOnFire `true` if on fire, `false` if not on fire.
 */
function setEntityIsOnFire(entity: Entity, isOnFire: boolean) {
    entity.metadata[0] = (isOnFire ? 1 : 0) as unknown as object
}

export interface ExtendedBot extends Bot {
    isOnFire(): boolean

    skills: {
        attack: AttackSkill
    }
}

export function createExtendedBot(botOption: any): ExtendedBot {
    let bot = createBot(botOption) as unknown as ExtendedBot
    bot.isOnFire = () => {
        return isEntityOnFire(bot.entity)
    }
    // The metadata of `isOnFire` for the bot will not update after its re-spawning.
    bot.on("death", () => {
        setEntityIsOnFire(bot.entity, false)
        logger.debug(`bot.entity.metadata "isOnFire" was set to false.`)
    })
    return bot as unknown as ExtendedBot
}


