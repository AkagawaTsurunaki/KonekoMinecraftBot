import {AngryBehaviour} from "../../behaviours/angry";
import {bot} from "../../../index";
import {AbstractState} from "../abstractState";

export class AttackPlayerState extends AbstractState {
    constructor() {
        super("AttackPlayerState")
    }

    private angryBehaviour = new AngryBehaviour()

    getTransitionValue(): number {
        if (this.angryBehaviour.pvpTarget == null) {
            return 0
        }
        return 0.99
    }

    onEnter() {
        super.onEnter();
    }

    async onUpdate() {
        super.onUpdate();
        const pvpTarget = this.angryBehaviour.pvpTarget;
        if (pvpTarget) {
            await bot.pvp.attack(pvpTarget)
        }
    }

    async onExit() {
        super.onExit();
        await bot.pvp.stop()
    }
}