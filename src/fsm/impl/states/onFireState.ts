import {AbstractState} from "../../abstractState";
import {myEmitter} from "../../../events/extendedBotEvents";
import {bot} from "../../../../index";
import {getLogger} from "../../../utils/logger";
import {clamp} from "../../../utils/math";
import {GotoWaterSkill} from "../../../skills/gotoWaterSkill";
import {Block} from "prismarine-block";
import {stateDoc} from "../../../decorator/stateDoc";
import {lock} from "../../../decorator/lock";

const logger = getLogger("OnFireState")


@stateDoc({
    name: "OnFireState",
    description: "Bot is on fire or in fire, trying to touch the nearest water block.",
    issue: "May take a very strange path to get close to the water block, resulting in being burned to death."
})
export class OnFireState extends AbstractState {
    constructor() {
        super("OnFireState");
    }

    private isOnFire: boolean = false
    private isInFire: boolean = false
    private waterBlock: Block | null = null

    getTransitionValue(): number {
        this.isOnFire = bot.isOnFire()
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
        this.waterBlock = GotoWaterSkill.findWaterBlockGoal()
    }

    @lock()
    async onUpdate() {
        super.onUpdate();
        // @ts-ignore
        GotoWaterSkill.gotoWater(this.waterBlock)
    }

    onExit() {
        super.onExit();
        if (!bot.isOnFire()) {
            bot.pathfinder.stop()
        }
    }

}