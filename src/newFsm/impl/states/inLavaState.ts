import {AbstractState} from "../../abstractState";
import {myEmitter} from "../../../events/extendedBotEvents";
import {getLogger} from "../../../utils/logger";
import {bot} from "../../../../index";
import {goals} from "mineflayer-pathfinder";
import {lock} from "../../../common/decorator";

const logger = getLogger("InLavaState")

export class InLavaState extends AbstractState {
    constructor() {
        super("InLavaState");
    }

    private isInLava: boolean = false

    getTransitionValue(): number {
        if (this.isInLava) {
            return 0.99
        }
        return 0;
    }

    onListen() {
        super.onListen();
        // If the bot is on fire, try to find the nearest water block
        myEmitter.on("botDamageEvent", async (sourceType, sourceCause, sourceDirect) => {
            logger.debug(sourceType.name)
            if (["lava"].includes(sourceType.name)) {
                this.isInLava = true

            }

            // if (["on_fire", "in_fire", "lava"].includes(sourceType.name)) {
            //     if (bot.game.dimension === "the_nether") {
            //         // Can not find water block in the nether expect use command /setblock or /fill
            //         logger.warn("No water block exists in `the_nether` dimension.")
            //         return
            //     }
            //
            // }
        })

        bot.on("path_update", () => {
            logger.debug("Pathfinding update")
        })

        bot.on("goal_reached", () => {
            logger.debug("Pathfinder finished.")
        })

    }

    onEnter() {
        super.onEnter();
        bot.pathfinder.stop()
        bot.setControlState("jump", true)
        bot.setControlState("forward", true)
        bot.chat("好烫啊~救命喵！")
    }

    @lock()
    async onUpdate() {
        super.onUpdate();
        await this.escapeFromFireSource()
        this.isInLava = false
    }

    onExit() {
        super.onExit();
        bot.setControlState("forward", false)
        bot.setControlState("jump", false)
    }

    private findWaterBlockGoal() {
        const water = bot.findBlock({
            point: bot.entity.position,
            matching: block => block.name === "water",
            count: 1,
            maxDistance: 64
        });
        if (!water) {
            logger.warn("Can not find the water block nearby.")
            return null;
        }

        return new goals.GoalBlock(water.position.x, water.position.y, water.position.z)
    }

    private async escapeFromFireSource() {
        try {
            const goalBlock = this.findWaterBlockGoal()
            if (goalBlock) {
                logger.debug("Pathfinder starting...")
                await bot.pathfinder.goto(goalBlock)
            } else {
                logger.warn("No water block to goto.")
            }
        } catch (e: any) {
            logger.error(e)
        }
    }

}