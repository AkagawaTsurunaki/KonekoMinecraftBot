import {bot} from "../../index";
import {goals} from "mineflayer-pathfinder";
import {getLogger} from "../utils/logger";
import {Block} from "prismarine-block";

const logger = getLogger("GotoWaterSkill")


export class GotoWaterSkill {
    public static findWaterBlockGoal() {
        if (bot.game.dimension === "the_nether") {
            // Can not find water block in the nether expect use command /setblock or /fill
            logger.warn("No water block exists in `the_nether` dimension.")
            return null;
        }
        return bot.findBlock({
            point: bot.entity.position,
            matching: block => block.name === "water",
            count: 1,
            maxDistance: 64
        })
    }

    public static gotoWater(water: Block | undefined | null) {
        try {
            if (water) {
                const goalBlock = new goals.GoalBlock(water.position.x, water.position.y, water.position.z)
                bot.pathfinder.setGoal(goalBlock)
            } else {
                logger.warn("Can not find the water block nearby.")
            }
        } catch (e: any) {
            logger.error(e)
        }
    }
}