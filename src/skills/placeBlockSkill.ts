import {bot, botOption} from "../../index";
import {Vec3} from "vec3";
import {getLogger} from "../utils/logger";


const logger = getLogger("SleepSkill")


export class PlaceBlockSkill {

    private static getPlayerLookAt(username: string, lookAtDistance: number) {
        const player = bot.players[username].entity;
        return bot.blockAtEntityCursor(player, lookAtDistance)
    }

    public static async placeBlockOtherPlayerLookedAt(username: string = botOption.masterName, lookAtDistance: number = 256) {
        const lookAtBlock = this.getPlayerLookAt(username, lookAtDistance);
        if (!lookAtBlock) return
        try {
            await bot.placeBlock(lookAtBlock, new Vec3(0, 1, 0))
        } catch (e: any) {
            if (e.message.includes("must be holding an item to place")) {
                logger.error(`Nothing to place, must be holding an item to place.`)
            }
        }
    }
}