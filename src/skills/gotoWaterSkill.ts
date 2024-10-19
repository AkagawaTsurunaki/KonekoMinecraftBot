import {goals} from "mineflayer-pathfinder";
import {getLogger} from "../util/logger";
import {Block} from "prismarine-block";
import {AbstractSkill} from "./abstractSkill";

const logger = getLogger("GotoWaterSkill")

export class GotoWaterSkill extends AbstractSkill {
    public findWaterBlockGoal() {
        if (this.bot.game.dimension === "the_nether") {
            // Can not find water block in the nether expect use command /setblock or /fill
            logger.warn("No water block exists in `the_nether` dimension.")
            return null;
        }
        return this.bot.findBlock({
            point: this.bot.entity.position,
            matching: block => block.name === "water",
            count: 1,
            maxDistance: 64
        })
    }

    public gotoWater(water: Block | undefined | null) {
        try {
            if (water) {
                const goalBlock = new goals.GoalBlock(water.position.x, water.position.y, water.position.z)
                this.bot.pathfinder.setGoal(goalBlock)
            } else {
                logger.warn("Can not find the water block nearby.")
            }
        } catch (e: any) {
            logger.error(e)
        }
    }
}