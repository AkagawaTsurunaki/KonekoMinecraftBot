import {State} from "./fsm";

export class IdleState extends State {

    public name = "主状态"

    cond() {
        return false
    }

    takeAction() {
    }

    updateEnv(env: any) {
    }
}