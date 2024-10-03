import {State} from "./fsm";
import {bot} from "../index";

export class DiveState extends State {

    public name: string = "潜水状态"

    cond() {
        // @ts-ignore
        if (bot.entity.isInWater) {
            if (bot.oxygenLevel) {
                if (bot.oxygenLevel < 5) {
                    return true
                }
                // else {
                //     bot.setControlState("jump", false)
                // }
            }
        }
        return false
    }

    takeAction() {
        bot.setControlState("jump", true)
    }

    updateEnv(env: any) {
    }

}