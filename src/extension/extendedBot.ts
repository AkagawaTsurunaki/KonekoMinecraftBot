import {Entity} from "prismarine-entity";
import {getLogger} from "../utils/logger";
import {bot} from "../../index";

const logger = getLogger("isEntityOnFire")

/**
 * Is on fire
 */
function isEntityOnFire(entity: Entity): boolean {
    const isOnFire = entity.metadata[0];
    logger.debug(isOnFire)
    // @ts-ignore
    return isOnFire === 1
}

export class ExtendedBot {
    private _isOnFire: boolean = false

    constructor() {
        bot.on("death", () => {
            // @ts-ignore
            bot.entity.metadata[0] = 0
        })
    }

    public get isOnFire(): boolean {
        this._isOnFire = isEntityOnFire(bot.entity)
        return this._isOnFire
    }
}

export function createExtendedBot() {
    return new ExtendedBot()
}


