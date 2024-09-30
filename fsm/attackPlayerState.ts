import {State} from "./fsm";
import {AngryBehaviour} from "../behaviours/angry";
import {bot} from "../index";

export class AttackPlayerState extends State {

    private angryBehaviour = new AngryBehaviour()

    cond(): boolean {
        if (this.angryBehaviour.pvpTarget == null) {
            bot.pvp.forceStop()
            return false
        }
        return true
    }

    async takeAction() {
        await bot.pvp.attack(this.angryBehaviour.pvpTarget)
    }

    updateEnv(env: any) {
    }

}