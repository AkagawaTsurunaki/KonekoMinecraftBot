import {AbstractState} from "../../abstractState";
import {Timer} from "../../../utils/timer";
import {range} from "../../../common/decorator";
import {stateDoc} from "../../../decorator/stateDoc";


@stateDoc({
    name: "IdleState",
    description: "Do nothing. It is also an entry node for other states."
})
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

}