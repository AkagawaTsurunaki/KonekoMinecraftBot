import {AbstractState} from "../abstractState";
import {FiniteStateMachine} from "../fsm";
import {getLogger} from "../../utils/logger";
import {myEmitter} from "../../events/extendedBotEvents";


const logger = getLogger("FiniteStateMachineImpl")


export abstract class FSMImpl implements FiniteStateMachine {
    resetWhenException: boolean
    currentState: AbstractState | null;
    allStates: AbstractState[]

    constructor() {
        this.resetWhenException = false
        this.currentState = null
        this.allStates = []
    }

    abstract init(): void

    abstract reset(): void

    start(): void {
        myEmitter.on("secondTick", () => {
            this.update()
        })
        this.allStates.forEach(state => state.onListen())
    }

    private getMaxTransitionValueState(): [AbstractState | null, number] {
        let maxTransitionValue = 0
        let maxTransitionValueState = null
        let statesMessage = ""

        this.currentState?.nextStates.forEach(state => {
            const transitionValue = state.getTransitionValue();
            statesMessage += `${state.id}: ${transitionValue}  `
            if (transitionValue > maxTransitionValue) {
                maxTransitionValueState = state
                maxTransitionValue = transitionValue
            }
        })

        logger.info(statesMessage)
        return [maxTransitionValueState, maxTransitionValue]
    }

    update(): void {
        try {
            if (this.currentState == null) return;
            const currentStateTransitionValue = this.currentState.getTransitionValue();
            logger.info(`--> ${this.currentState.id}: ${currentStateTransitionValue} <--`)
            const [maxTransitionValueState, maxTransitionValue] = this.getMaxTransitionValueState();

            if (currentStateTransitionValue > maxTransitionValue) {
                this.currentState.onUpdate()
            } else {
                if (maxTransitionValueState !== null) {
                    this.currentState.onExit()
                    // this.currentState.nextStates.forEach(state => state.removeEventListeners())
                    this.currentState = maxTransitionValueState
                    // this.currentState.nextStates.forEach(state => state.registerEventListeners())
                    this.currentState.onEnter()
                }
            }
        } catch (e) {
            logger.fatal(e)
            if (this.resetWhenException) {
                logger.fatal(`Unhandled exception cause the finite state machine crashed.`)
            } else {
                logger.warn(`Unhandled exception cause the finite state machine reset.`)
                this.reset()
            }
        }
    }

}