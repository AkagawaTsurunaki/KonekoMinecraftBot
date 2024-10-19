import {Vec3} from "vec3";
import {getLogger} from "../utils/logger";
import {AbstractSkill} from "./abstractSkill";

const logger = getLogger("SleepSkill")

export class PlaceBlockSkill extends AbstractSkill{

    private getPlayerLookAt(username: string, lookAtDistance: number) {
        const player = this.bot.players[username].entity;
        return this.bot.blockAtEntityCursor(player, lookAtDistance)
    }

    public async placeBlockOtherPlayerLookedAt(username: string, lookAtDistance: number = 256) {
        const lookAtBlock = this.getPlayerLookAt(username, lookAtDistance);
        if (!lookAtBlock) return
        try {
            await this.bot.placeBlock(lookAtBlock, new Vec3(0, 1, 0))
        } catch (e: any) {
            if (e.message.includes("must be holding an item to place")) {
                logger.error(`Nothing to place, must be holding an item to place.`)
            }
        }
    }
}