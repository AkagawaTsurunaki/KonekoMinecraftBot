import {AbstractState} from "../../abstractState";
import {Timer} from "../../../utils/timer";
import {range} from "../../../common/decorator";

export class IdleState extends AbstractState {

    private timer: Timer
    private scaleFactor: number = 0.1

    constructor() {
        super("IdleState", "Do nothing. It is also an entry node for other states.");
        this.timer = new Timer()
    }

    @range(0, 1)
    getTransitionValue(): number {
        this.timer.onPhysicsTick()
        return (Math.sin(this.timer.time) + 1) * this.scaleFactor;
    }

}