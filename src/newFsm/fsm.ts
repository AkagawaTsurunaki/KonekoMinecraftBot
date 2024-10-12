import {AbstractState} from "./abstractState";

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


export interface FiniteStateMachine {
    currentState: AbstractState | null
    allStates: AbstractState[]

    init(): void

    start(): void

    update(): void

    reset(): void
}