import {AbstractState} from "../../abstractState";
import {Timer} from "../../../utils/timer";
import {stateDoc} from "../../../decorator/stateDoc";
import {range} from "../../../decorator/range";
import {ExtendedBot} from "../../../extension/extendedBot";


@stateDoc({
    name: "IdleState",
    description: "Do nothing. It is also an entry node for other states."
})
export class IdleState extends AbstractState {

    private timer: Timer
    private scaleFactor: number = 0.1

    constructor(bot: ExtendedBot) {
        super("IdleState", bot);
        this.timer = new Timer()
    }

    @range(0, 1)
    getTransitionValue(): number {
        this.timer.onPhysicsTick()
        return (Math.sin(this.timer.time) + 1) * this.scaleFactor;
    }

}