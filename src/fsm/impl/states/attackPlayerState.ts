import {AbstractState} from "../../abstractState";
import {AngryBehaviour} from "../../../behaviours/angry";
import {bot} from "../../../../index";


export class AttackPlayerState extends AbstractState {
    constructor() {
        super("AttackPlayerState",
            "Players who has maximum angry value will be attacked first. " +
            "Player who has dead or has angry value below the threshold of attacking will be forgiven." +
            "All players will be forgiven when the bot dead.")
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