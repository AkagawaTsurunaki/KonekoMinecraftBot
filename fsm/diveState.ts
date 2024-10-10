import {AbstractState} from "./fsm";
import {bot} from "../index";
import {clamp, dot} from "../utils/math";


export class DiveState extends AbstractState {

    private inWaterWeight = 0.1
    private oxygenLevelWeight = 0.4
    private healthWeight = 0.5

    constructor() {
        super("潜水状态");
    }

    getCondVal(): number {
        // 机器人是否在水中，氧气值含量，生命值
        // @ts-ignore
        const inWater = bot.entity.isInWater
        if (!inWater) return 0
        const condVal = dot([this.inWaterWeight, this.oxygenLevelWeight, this.healthWeight],
            [inWater ? 1 : 0, Math.abs(bot.oxygenLevel - 20) / 20, Math.abs(bot.health - 20) / 20])
        return clamp(condVal ? condVal : 0, 0, 1);
    }

    onEntered() {
        bot.setControlState('jump', true)
    }

    onExited() {
        bot.setControlState('jump', false)
    }

    onUpdate(...args: any[]) {
    }

}