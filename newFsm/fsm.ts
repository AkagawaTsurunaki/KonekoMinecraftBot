import {EventListenersManager} from "../events/eventListenerManager";
import {myEmitter} from "../events/secondEvent";
import {IdleState} from "./states/idleState";
import {AttackHostilesState} from "./states/attackHostilesState";
import {error} from "../utils/log";
import {bot} from "../index";

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
}


export abstract class AbstractState extends EventListenersManager implements State {
    id: string;
    nextStates: State[]
    protected transitionValue: number

    constructor(id: string) {
        super()
        this.id = id
        this.transitionValue = 0
        this.nextStates = []
    }

    onEnter(): void {
        this.registerEventListeners()
    }

    onExit(): void {
        this.removeEventListeners()
        this.transitionValue = 0
    }

    abstract onUpdate(): void

    abstract registerEventListeners(): void

    abstract getTransitionValue(): number
}

interface FiniteStateMachine {
    currentState: State | null

    init(): void

    start(): void

    update(): void

    reset(): void
}


abstract class AutoFiniteStateMachine implements FiniteStateMachine {
    resetWhenException: boolean
    currentState: State | null;

    constructor() {
        this.resetWhenException = false
        this.currentState = null
    }

    init(): void {
    }

    abstract reset(): void

    start(): void {
        myEmitter.on("secondTick", () => {
            this.update()
        })
    }

    private getMaxTransitionValueState(): [State | null, number] {
        let maxTransitionValue = 0
        let maxTransitionValueState = null
        this.currentState?.nextStates.forEach(state => {
            const transitionValue = state.getTransitionValue();
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
            const [maxTransitionValueState, maxTransitionValue] = this.getMaxTransitionValueState();

            if (currentStateTransitionValue > maxTransitionValue) {
                this.currentState.onUpdate()
            } else {
                this.currentState.onExit()
                if (maxTransitionValueState !== null) {
                    this.currentState = maxTransitionValueState
                }
                this.currentState.onEnter()
            }
        } catch (e) {
            error(e)
            if (this.resetWhenException) {
                const msg = "未经处理的异常导致的有限状态机停机"
                error(msg)
                bot.chat(msg)
            } else {
                this.reset()
            }
        }
    }

}

export class NewFSM extends AutoFiniteStateMachine {


    idleState: State | null = null
    attackHostilesState: State | null = null


    init() {
        this.idleState = new IdleState()
        this.attackHostilesState = new AttackHostilesState()
        this.currentState = this.idleState
    }

    reset() {
        this.currentState = this.idleState
    }
}