import {AbstractState} from "../../abstractState";
import {range} from "../../../common/decorator";
import {clamp, dot} from "../../../utils/math";
import {bot} from "../../../../index";


export class DiveState extends AbstractState {

    constructor() {
        super("DiveState",
            "Bot should surface or sink if in water. Oxygen level and health are also considered.",
            "It may also oscillate up and down in shallow water.");
    }

    private inWaterWeight = 0.1
    private oxygenLevelWeight = 0.4
    private healthWeight = 0.5

    @range(0, 1)
    getTransitionValue(): number {
        // Whether the bot is in water, oxygen level, health
        // @ts-ignore
        const inWater = bot.entity.isInWater
        if (!inWater) return 0
        const condVal = dot([this.inWaterWeight, this.oxygenLevelWeight, this.healthWeight],
            [inWater ? 1 : 0, Math.abs(bot.oxygenLevel - 20) / 20, Math.abs(bot.health - 20) / 20])
        return clamp(condVal ? condVal : 0, 0, 1);
    }

    onEnter() {
        super.onEnter();
        bot.setControlState('jump', true)
    }

    onExit() {
        super.onExit();
        bot.setControlState('jump', false)
    }

}