import {State} from "./fsm";
import {Attack} from "../skills/attack";
import {bot} from "../index";

export class AttackHostileState extends State {

    cond() {
        const hostile = Attack.findNearestHostile(16)
        if (!hostile) return false
        const dist = bot.entity.position.distanceTo(hostile.position)
        return dist < 9
    }

    async takeAction() {
        await Attack.attackNearestHostiles(9)
    }

    updateEnv(env: any) {
    }

}