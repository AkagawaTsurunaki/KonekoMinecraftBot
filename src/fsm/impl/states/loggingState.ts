import {Block} from "prismarine-block";
import {Entity} from "prismarine-entity";
import {getLogger} from "../../../utils/logger";
import {AbstractState} from "../../abstractState";
import {BlockUpdateIntent} from "../../../intent/blockUpdateIntent";
import {bot} from "../../../../index";
import {LoggingSkill} from "../../../skills/loggingSkill";
import {stateDoc} from "../../../decorator/stateDoc";
import {lock} from "../../../decorator/lock";


const logger = getLogger("LoggingState")

@stateDoc({
    name: "LoggingState",
    description: "If a player broke some log blocks nearby, " +
        "bot will also try to help collect the wood with the axe equipped."
})
export class LoggingState extends AbstractState {
    constructor() {
        super("LoggingState");
    }

    private loggingIntent = new BlockUpdateIntent(3, 30)
    private logName: string | null = null

    getTransitionValue(): number {
        if (this.loggingIntent.getIntent()) {
            return 0.99
        }
        return 0;
    }

    onListen() {
        super.onListen();
        // @ts-ignore
        bot.on("blockBreakProgressEnd", (block: Block, entity: Entity) => {
            logger.debug(entity.type, block.name)
            if (entity.type === "player" && entity.username !== bot.username && block.name.includes("log")) {
                this.loggingIntent.setIntent()
                this.logName = block.name
            }
        })
    }

    @lock()
    async onUpdate() {
        super.onUpdate();
        if (this.logName != null) {
            await LoggingSkill.logging(this.logName, () => false)
        }
        this.loggingIntent.resetIntent()
    }

    onExit() {
        super.onExit();
    }

}