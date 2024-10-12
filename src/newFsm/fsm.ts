import {myEmitter} from "../events/secondEvent";
import {debug, error, log} from "../utils/log";

interface Transition {
    getTransitionValue(): number
}


export interface State extends Transition {
    id: string
    nextStates: State[]

    /**
     * 当进入此状态时执行的操作。每次状态转移进入时只会调用一次。
     */
    onEnter(): void

    /**
     * 当保持此状态时执行的动作。每次状态转移保持时按秒调用。
     */
    onUpdate(): void

    /**
     * 当退出此状态时执行的操作。每次状态转移退出时只会调用一次。
     */
    onExit(): void

    onListen(): void
}


export abstract class AbstractState implements State {
    id: string;
    nextStates: AbstractState[]

    constructor(id: string) {
        this.id = id
        this.nextStates = []
    }

    onEnter(): void {
        debug(`进入状态 ${this.id}`)
    }

    onExit(): void {
        debug(`脱离状态 ${this.id}`)
    }

    onUpdate(): void {
        debug(`帧执行状态 ${this.id}`)
    }

    onListen() {
    }

    abstract getTransitionValue(): number
}

export interface FiniteStateMachine {
    currentState: AbstractState | null

    init(): void

    start(): void

    update(): void

    reset(): void
}


export abstract class AutoFiniteStateMachine implements FiniteStateMachine {
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

        log(statesMessage)
        return [maxTransitionValueState, maxTransitionValue]
    }

    update(): void {
        try {
            if (this.currentState == null) return;
            const currentStateTransitionValue = this.currentState.getTransitionValue();
            log(`--> ${this.currentState.id}: ${currentStateTransitionValue} <--`)
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
            error(e)
            if (this.resetWhenException) {
                const msg = "未经处理的异常导致的有限状态机停机"
                error(msg)
            } else {
                this.reset()
            }
        }
    }

}