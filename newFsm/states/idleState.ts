import {BaseState} from "../fsm";
import {lock} from "../../common/decorator";

export class IdleState extends BaseState {

    constructor() {
        super("主状态");
        this.transitionValue = 0.01
    }

    onEnter() {
        super.onEnter();
    }

    onExit() {
        super.onExit();
    }

    onUpdate() {
        this.transitionValue = 0.01
    }

    registerEventListeners(): void {
    }
}