import {AbstractState} from "../../abstractState";
import {clamp, dot} from "../../../utils/math";
import {stateDoc} from "../../../decorator/stateDoc";
import {range} from "../../../decorator/range";
import {ExtendedBot} from "../../../extension/extendedBot";

@stateDoc({
    name: "DiveState",
    description: "Bot should surface or sink if in water. Oxygen level and health are also considered.",
    issue: "It may also oscillate up and down in shallow water."
})
export class DiveState extends AbstractState {

    constructor(bot: ExtendedBot) {
        super("DiveState", bot);
    }

    private inWaterWeight = 0.1
    private oxygenLevelWeight = 0.4
    private healthWeight = 0.5

    @range(0, 1)
    getTransitionValue(): number {
        // Whether the bot is in water, oxygen level, health
        // @ts-ignore
        const inWater = this.bot.entity.isInWater
        if (!inWater) return 0
        const condVal = dot([this.inWaterWeight, this.oxygenLevelWeight, this.healthWeight],
            [inWater ? 1 : 0, Math.abs(this.bot.oxygenLevel - 20) / 20, Math.abs(this.bot.health - 20) / 20])
        return clamp(condVal ? condVal : 0, 0, 1);
    }

    onEnter() {
        super.onEnter();
        this.bot.setControlState('jump', true)
    }

    onExit() {
        super.onExit();
        this.bot.setControlState('jump', false)
    }

}