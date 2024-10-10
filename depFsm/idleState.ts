import {AbstractState} from "./fsm";


export class IdleState extends AbstractState {

    constructor() {
        super("主状态");
    }


    getCondVal(): number {
        return 0.01;
    }

    onEntered() {
    }

    onExited() {
    }

    onUpdate(...args: any[]) {
    }

}