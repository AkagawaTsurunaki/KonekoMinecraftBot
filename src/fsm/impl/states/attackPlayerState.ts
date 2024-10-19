import {AbstractState} from "../../abstractState";
import {stateDoc} from "../../../decorator/stateDoc";
import {ExtendedBot} from "../../../extension/extendedBot";
import {AngryAlgorithm} from "../../../algorithm/angryAlgorithm";

@stateDoc({
    name: "AttackPlayerState",
    description: "Players who has maximum angry value will be attacked first. " +
        "Player who has dead or has angry value below the threshold of attacking will be forgiven." +
        "All players will be forgiven when the bot dead."
})
export class AttackPlayerState extends AbstractState {
    constructor(bot: ExtendedBot) {
        super("AttackPlayerState", bot)
    }

    private angryBehaviour = new AngryAlgorithm()

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
            await this.bot.pvp.attack(pvpTarget)
        }
    }

    async onExit() {
        super.onExit();
        await this.bot.pvp.stop()
    }
}