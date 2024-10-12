import {AbstractState} from "../../abstractState";
import {Timer} from "../../../utils/timer";
import {range} from "../../../common/decorator";

export class IdleState extends AbstractState {

    private timer: Timer
    private scaleFactor: number = 0.1

    constructor() {
        super("IdleState");
        this.timer = new Timer()
    }

    @range(0, 1)
    getTransitionValue(): number {
        this.timer.onPhysicsTick()
        return (Math.sin(this.timer.time) + 1) * this.scaleFactor;
    }

    registerEventListeners(): void {
    }

    onEnter(): void {
        super.onEnter()
    }

    onUpdate(): void {
        super.onUpdate()
    }

    onExit(): void {
        super.onExit()
    }

}