import {getLogger} from "../utils/logger";
import {State} from "./fsm";


const logger = getLogger("AbstractState")


export abstract class AbstractState implements State {
    id: string;
    description: string
    issue: string | null
    nextStates: AbstractState[]

    constructor(id: string, description: string, issue: string | null = null) {
        this.id = id
        this.description = description
        this.issue = issue
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