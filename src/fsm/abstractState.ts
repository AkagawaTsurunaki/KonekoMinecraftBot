import {getLogger} from "../utils/logger";
import {State} from "./fsm";
import {ExtendedBot} from "../extension/extendedBot";


const logger = getLogger("AbstractState")


export abstract class AbstractState implements State {
    id: string;
    nextStates: AbstractState[]
    bot: ExtendedBot

    constructor(id: string, bot: ExtendedBot) {
        this.id = id
        this.bot = bot
        this.nextStates = []
    }

    onEnter(): void {
        logger.debug(`State entered: ${this.id}`)
    }

    onExit(): void {
        logger.debug(`State exited: ${this.id}`)
    }

    onUpdate(): void {
        logger.debug(`State updated: ${this.id}`)
    }

    onListen() {
    }

    abstract getTransitionValue(): number
}