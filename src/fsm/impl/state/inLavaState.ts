import {AbstractState} from "../../abstractState";
import {getLogger} from "../../../util/logger";
import {ExtendedBot} from "../../../extension/extendedBot";
import {stateDoc} from "../../../common/decorator/stateDoc";

const logger = getLogger("InLavaState")

@stateDoc({
    name: "InLavaState",
    description: "The robot panics in the lava and will randomly jump around."
})
export class InLavaState extends AbstractState {
    constructor(bot: ExtendedBot) {
        super("InLavaState", bot);
    }

    isInLava = false

    getTransitionValue(): number {
        // @ts-ignore
        if (this.bot.entity.isInLava) {
            return 0.99
        }
        if (this.isInLava) {
            return 0.99
        }
        return 0;
    }

    onListen() {
        super.onListen();
        this.bot.events.on("botDamageEvent", async (sourceType) => {
            this.isInLava = sourceType.name === "lava";
        })
    }

    onEnter() {
        super.onEnter();
        this.bot.pathfinder.stop()
        logger.info("Insane control state mode.")
        this.bot.setControlState("jump", true)
        this.bot.setControlState("forward", true)
    }

    onExit() {
        super.onExit();
        this.bot.setControlState("forward", false)
        this.bot.setControlState("jump", false)
    }
}