import {AbstractState} from "../../abstractState";
import {getLogger} from "../../../utils/logger";
import {myEmitter} from "../../../events/extendedBotEvents";
import {stateDoc} from "../../../decorator/stateDoc";
import {ExtendedBot} from "../../../extension/extendedBot";

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
        myEmitter.on("botDamageEvent", async (sourceType) => {
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