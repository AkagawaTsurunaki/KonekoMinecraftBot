import {AbstractState} from "../../abstractState";
import {getLogger} from "../../../utils/logger";
import {bot} from "../../../../index";
import {myEmitter} from "../../../events/extendedBotEvents";

const logger = getLogger("InLavaState")

export class InLavaState extends AbstractState {
    constructor() {
        super("InLavaState");
    }

    isInLava = false

    getTransitionValue(): number {
        // @ts-ignore
        if (bot.entity.isInLava) {
            return 0.99
        }
        if (this.isInLava) {
            return 0.99
        }
        return 0;
    }

    onListen() {
        super.onListen();
        myEmitter.on("botDamageEvent", async (sourceType, sourceCause, sourceDirect) => {
            this.isInLava = sourceType.name === "lava";
        })
    }

    onEnter() {
        super.onEnter();
        bot.pathfinder.stop()
        logger.info("Insane control state mode.")
        bot.setControlState("jump", true)
        bot.setControlState("forward", true)
    }

    onExit() {
        super.onExit();
        bot.setControlState("forward", false)
        bot.setControlState("jump", false)
    }
}