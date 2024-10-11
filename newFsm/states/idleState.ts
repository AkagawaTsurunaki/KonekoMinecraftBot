import {AbstractState} from "../fsm";
import {Timer} from "../../utils/timer";
import {range} from "../../common/decorator";

export class IdleState extends AbstractState {

    private timer: Timer
    private scaleFactor: number = 0.1

    constructor() {
        super("主状态");
        this.timer = new Timer()
    }

    onUpdate(): void {
        // 无事可做
    }

    registerEventListeners(): void {
        this.addEventListener("physicsTick", () => {
            this.timer.onPhysicsTick()
        })
    }

    @range(0, 1)
    getTransitionValue(): number {
        return Math.sin(this.timer.time) * this.scaleFactor;
    }

}