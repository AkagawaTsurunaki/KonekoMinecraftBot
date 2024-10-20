import {AbstractState} from "../abstractState";
import {FiniteStateMachine} from "../fsm";
import {getLogger} from "../../util/logger";

const logger = getLogger("FiniteStateMachineImpl")

export abstract class FSMImpl implements FiniteStateMachine {
    resetWhenException: boolean
    currentState: AbstractState | null;
    allStates: AbstractState[]
    protected statesTransitionValueMap: Map<string, number>

    constructor() {
        this.resetWhenException = false
        this.currentState = null
        this.allStates = []
        this.statesTransitionValueMap = new Map<string, number>()
    }

    abstract init(): void

    abstract reset(): void

    abstract start(): void

    private getMaxTransitionValueState(): [AbstractState | null, number] {
        let maxTransitionValue = 0
        let maxTransitionValueState = null

        this.currentState?.nextStates.forEach(state => {
            const transitionValue = state.getTransitionValue();
            this.statesTransitionValueMap.set(state.id, transitionValue)
            if (transitionValue > maxTransitionValue) {
                maxTransitionValueState = state
                maxTransitionValue = transitionValue
            }
        })

        return [maxTransitionValueState, maxTransitionValue]
    }

    update(): void {
        try {
            if (this.currentState == null) return;
            const currentStateTransitionValue = this.currentState.getTransitionValue();
            this.statesTransitionValueMap.set(this.currentState.id, currentStateTransitionValue)

            const [maxTransitionValueState, maxTransitionValue] = this.getMaxTransitionValueState();

            if (currentStateTransitionValue > maxTransitionValue) {
                this.currentState.onUpdate()
            } else {
                if (maxTransitionValueState !== null) {
                    this.currentState.onExit()
                    this.currentState = maxTransitionValueState
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