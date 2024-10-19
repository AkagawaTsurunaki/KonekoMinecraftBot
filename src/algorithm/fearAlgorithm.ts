import {createLinearFunction} from "../util/math";
import {BEGINNING_OF_DAY, BEGINNING_OF_NIGHT, BEGINNING_OF_SUNRISE, BEGINNING_OF_SUNSET} from "../common/const";
import {AbstractAlgorithm} from "./abstractAlgorithm";
import {ExtendedBot} from "../extension/extendedBot";

/**
 * 根据 [难度，饥饿值，饱和度，生命值，月相，时间] 计算恐惧向量。
 */
export class FearAlgorithm extends AbstractAlgorithm {
    constructor(bot: ExtendedBot) {
        super(bot);
    }

    private readonly sunset = createLinearFunction(BEGINNING_OF_SUNSET, 0.0, BEGINNING_OF_NIGHT, 1.0)
    private readonly sunrise = createLinearFunction(BEGINNING_OF_SUNRISE, 1.0, BEGINNING_OF_DAY, 0.0);
    private readonly MAX_FOOD: number = 20
    private readonly MAX_FOOD_SATURATION: number = 20
    private readonly MAX_HEALTH: number = 20

    private readonly difficultyMap: { [key: string]: number } = {
        'peaceful': 0.1,
        'easy': 0.3,
        'normal': 0.6,
        'hard': 1.0
    }

    /**
     * [MoonPhaseID： DifficultyValue] 的映射。
     *
     * 月相对沼泽生物群系中史莱姆的生成有影响，并有助于区域难度的计算。
     * 月亮越圆，效果越大。
     *
     * 月亮实际上不必在天空中才能产生这种效果，因为月亮存在于白天和各个维度。
     * @private
     */
    private readonly moonPhaseDifficultyMap: { [key: number]: number } = {
        '0': 1,
        '1': 0.75,
        '2': 0.5,
        '3': 0.25,
        '4': 0,
        '5': 0.25,
        '6': 0.5,
        '7': 0.75
    }


    private time(timeOfDay: number) {
        if (BEGINNING_OF_SUNSET < timeOfDay && timeOfDay <= BEGINNING_OF_NIGHT) {
            return this.sunset(timeOfDay)
        } else if (BEGINNING_OF_NIGHT < timeOfDay && timeOfDay <= BEGINNING_OF_SUNRISE) {
            return 1.0
        } else if (BEGINNING_OF_SUNRISE < timeOfDay && timeOfDay <= BEGINNING_OF_DAY) {
            return this.sunrise(timeOfDay)
        } else {
            return 0.0
        }
    }

    /**
     * 返回 0~1 之间的常数，用以代表恐惧向量
     * [难度，饥饿值，饱和度，生命值，月相，时间]
     */
    public getFearVector(): Array<number> {
        return [
            this.difficultyMap[this.bot.game.difficulty],
            (this.MAX_FOOD - this.bot.food) / this.MAX_FOOD,
            (this.MAX_FOOD_SATURATION - this.bot.foodSaturation) / this.MAX_FOOD_SATURATION,
            (this.MAX_HEALTH - this.bot.health) / this.MAX_HEALTH,
            this.moonPhaseDifficultyMap[this.bot.time.moonPhase],
            this.time(this.bot.time.timeOfDay)
        ]
    }
}