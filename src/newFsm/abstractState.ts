import {getLogger} from "../utils/log";
import {State} from "./fsm";


const logger = getLogger("AbstractState")


export abstract class AbstractState implements State {
    id: string;
    nextStates: AbstractState[]

    constructor(id: string) {
        this.id = id
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