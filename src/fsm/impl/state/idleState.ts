import {AbstractState} from "../../abstractState";
import {Timer} from "../../../util/timer";
import {ExtendedBot} from "../../../extension/extendedBot";
import {range} from "../../../common/decorator/range";
import {stateDoc} from "../../../common/decorator/stateDoc";


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