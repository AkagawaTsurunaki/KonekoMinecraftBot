import {AbstractState} from "../../abstractState";
import {getLogger} from "../../../util/logger";
import {clamp} from "../../../util/math";
import {GotoWaterSkill} from "../../../skill/gotoWaterSkill";
import {Block} from "prismarine-block";
import {ExtendedBot} from "../../../extension/extendedBot";
import {lock} from "../../../common/decorator/lock";
import {stateDoc} from "../../../common/decorator/stateDoc";
import {myEmitter} from "../../../extension/eventEmitter/extendedEventEmitter";

const logger = getLogger("OnFireState")


@stateDoc({
    name: "OnFireState",
    description: "Bot is on fire or in fire, trying to touch the nearest water block.",
    issue: "May take a very strange path to get close to the water block, resulting in being burned to death."
})
export class OnFireState extends AbstractState {
    constructor(bot: ExtendedBot) {
        super("OnFireState", bot);
    }

    private isOnFire: boolean = false
    private isInFire: boolean = false
    private waterBlock: Block | null = null

    getTransitionValue(): number {
        this.isOnFire = this.bot.isOnFire()
        return clamp((this.isOnFire ? 0.6 : 0) + (this.isInFire ? 0.9 : 0), 0, 1)
    }

    onListen() {
        super.onListen();
        myEmitter.on("botDamageEvent", async (sourceType, sourceCause, sourceDirect) => {
            if (sourceType.name === "on_fire") {
                this.isOnFire = true
            } else if (sourceType.name === "in_fire") {
                // this.isInFire = true
            }
        })
    }

    async onEnter() {
        super.onEnter();
        logger.info("Searching for water blocks nearby.")
        this.waterBlock = this.bot.skills.gotoWater.findWaterBlockGoal()
    }

    @lock()
    async onUpdate() {
        super.onUpdate();
        // @ts-ignore
        GotoWaterSkill.gotoWater(this.waterBlock)
    }

    onExit() {
        super.onExit();
        if (!this.bot.isOnFire()) {
            this.bot.pathfinder.stop()
        }
    }

}