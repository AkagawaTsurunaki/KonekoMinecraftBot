import {range} from "../common/decorator";
import {EventListenersManager} from "../events/eventListenerManager";

interface Transition {
    transitionValue: number

    getTransitionValue(): number
}


export interface State extends Transition {
    id: string

    /**
     * 当调用时更新该状态的转移值。
     */
    onUpdate(): void

    /**
     * 当进入此状态时执行的操作。
     */
    onEnter(): void

    /**
     * 当退出此状态时执行的操作。
     */
    onExit(): void
}


class BaseState extends EventListenersManager implements State {
    id: string;
    transitionValue: number;

    constructor(id: string) {
        super()
        this.id = id
        this.transitionValue = 0
    }

    @range(0, 1)
    getTransitionValue(): number {
        return this.transitionValue;
    }

    onEnter(): void {
        this.registerEventListeners()
    }

    onExit(): void {
        this.removeEventListeners()
    }

    onUpdate(): void {
    }

    registerEventListeners(): void {
    }
}