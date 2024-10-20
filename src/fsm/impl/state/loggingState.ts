import {Block} from "prismarine-block";
import {Entity} from "prismarine-entity";
import {getLogger} from "../../../util/logger";
import {AbstractState} from "../../abstractState";
import {ExtendedBot} from "../../../extension/extendedBot";
import {lock} from "../../../common/decorator/lock";
import {stateDoc} from "../../../common/decorator/stateDoc";
import {BlockUpdateCognition} from "../../../cognition/blockUpdateCognition";

const logger = getLogger("LoggingState")

@stateDoc({
    name: "LoggingState",
    description: "If a player broke some log blocks nearby, " +
        "bot will also try to help collect the wood with the axe equipped."
})
export class LoggingState extends AbstractState {
    constructor(bot: ExtendedBot) {
        super("LoggingState", bot);
    }

    private loggingIntent = new BlockUpdateCognition(3, 30)
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
        this.bot.on("blockBreakProgressEnd", (block: Block, entity: Entity) => {
            logger.debug(entity.type, block.name)
            if (entity.type === "player" && entity.username !== this.bot.username && block.name.includes("log")) {
                this.loggingIntent.setIntent()
                this.logName = block.name
            }
        })
    }

    @lock()
    async onUpdate() {
        super.onUpdate();
        if (this.logName != null) {
            await this.bot.skills.logging.logging(this.logName, () => false)
        }
        this.loggingIntent.resetIntent()
    }

    onExit() {
        super.onExit();
    }

}