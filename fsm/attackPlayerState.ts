import {AbstractState} from "./fsm";
import {AngryBehaviour} from "../behaviours/angry";
import {bot} from "../index";

export class AttackPlayerState extends AbstractState {

    private angryBehaviour = new AngryBehaviour()

    constructor() {
        super("攻击玩家状态");
    }


    getCondVal(): number {
        if (this.angryBehaviour.pvpTarget == null) {
            return 0
        }
        return 0.99
    }

    async onEnter() {
        await bot.pvp.attack(this.angryBehaviour.pvpTarget)
    }

    async onExit() {
        await bot.pvp.stop()
    }

    onUpdate(...args: any[]) {
    }

}