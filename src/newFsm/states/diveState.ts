import {bot} from "../../../index";
import {clamp, dot} from "../../utils/math";
import {range} from "../../common/decorator";
import {AbstractState} from "../abstractState";


export class DiveState extends AbstractState {

    constructor() {
        super("DiveState");
    }

    private inWaterWeight = 0.1
    private oxygenLevelWeight = 0.4
    private healthWeight = 0.5

    @range(0, 1)
    getTransitionValue(): number {
        // 机器人是否在水中，氧气值含量，生命值
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