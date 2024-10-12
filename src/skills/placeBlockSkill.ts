import {bot} from "../../index";
import {Vec3} from "vec3";
import {error} from "../utils/log";
import {masterName} from "../common/const";

export class PlaceBlockSkill {

    private static getPlayerLookAt(username: string, lookAtDistance: number) {
        const player = bot.players[username].entity;
        return bot.blockAtEntityCursor(player, lookAtDistance)
    }

    public static async placeBlockOtherPlayerLookedAt(username: string = masterName, lookAtDistance: number = 256) {
        const lookAtBlock = this.getPlayerLookAt(username, lookAtDistance);
        if (!lookAtBlock) return
        try {
            await bot.placeBlock(lookAtBlock, new Vec3(0, 1, 0))
        } catch (e: any) {
            if (e.message.includes("must be holding an item to place")) {
                error(`手中没有物品可以放置`)
            }
        }
    }
}