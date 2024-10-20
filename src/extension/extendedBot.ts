import {Entity} from "prismarine-entity";
import {getLogger} from "../util/logger";
import {Bot, createBot} from "mineflayer";
import {AttackSkill} from "../skill/attackSkill";
import {CraftSkill} from "../skill/craftSkill";
import {FarmSkill} from "../skill/farmSkill";
import {FishingSkill} from "../skill/fishingSkill";
import {FollowSkill} from "../skill/followSkill";
import {GotoWaterSkill} from "../skill/gotoWaterSkill";
import {LoggingSkill} from "../skill/loggingSkill";
import {PlaceBlockSkill} from "../skill/placeBlockSkill";
import {QuitSkill} from "../skill/quitSkill";
import {SleepSkill} from "../skill/sleepSkill";
import {TossSkill} from "../skill/tossSkill";
import {ExtendedUtil} from "./extendedUtil";

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
        craft: CraftSkill
        farm: FarmSkill
        fishing: FishingSkill
        follow: FollowSkill
        gotoWater: GotoWaterSkill
        logging: LoggingSkill
        placeBlock: PlaceBlockSkill
        quit: QuitSkill
        sleep: SleepSkill
        toss: TossSkill
    }

    utils: ExtendedUtil

    option: {
        "host": string,
        "port": number,
        "username": string,
        "version": string,
        "masterName": string
    }
}

export function createExtendedBot(botOption: any): ExtendedBot {
    let bot = createBot(botOption) as unknown as ExtendedBot
    bot.isOnFire = () => {
        return isEntityOnFire(bot.entity)
    }

    bot.option = botOption

    // Inject skills.
    bot.skills = {
        attack: new AttackSkill(bot),
        craft: new CraftSkill(bot),
        farm: new FarmSkill(bot),
        fishing: new FishingSkill(bot),
        follow: new FollowSkill(bot),
        gotoWater: new GotoWaterSkill(bot),
        logging: new LoggingSkill(bot),
        placeBlock: new PlaceBlockSkill(bot),
        quit: new QuitSkill(bot),
        sleep: new SleepSkill(bot),
        toss: new TossSkill(bot),
    }

    bot.utils = new ExtendedUtil(bot)
    // The metadata of `isOnFire` for the bot will not update after its re-spawning.
    bot.on("death", () => {
        setEntityIsOnFire(bot.entity, false)
        logger.debug(`bot.entity.metadata "isOnFire" was set to false.`)
    })

    bot.on("error", (e: any) => {
        if (e.errno === -3008) {
            logger.fatal("DNS error: \n" +
                "Are you sure the address of the server is right?")
        } else if (e.errno === -4077) {
            logger.fatal("Protocol version conflict: \n" +
                "The Minecraft server does not correspond to your client version.")
        } else if (e.errno === -4078) {
            logger.fatal("Failed to connect the server:\n" +
                " Possible solutions: \n" +
                "1. Check if your host and port are right. \n" +
                "2. Check if your Minecraft client (not bot) can join the game. \n" +
                "3. Are you sure your server is running and open the port?")
        } else if (e.errno === -4079) {
            logger.fatal("Generic error: \n" +
                "See detail")
        } else {
            logger.fatal("Unhandled error: \n" +
                "I have no idea to deal with it except crashed, sorry nya...")
        }

        // Can not handle this situation. Crashed!
        throw e
    })

    return bot as unknown as ExtendedBot
}


