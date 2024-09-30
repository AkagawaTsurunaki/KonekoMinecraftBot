import {createLinearFunction} from "../utils/math";
import {bot} from "../index";

/**
 * 根据 [难度，饥饿值，饱和度，生命值，月相，时间] 计算恐惧向量。
 */
export class FearBehaviour {

    private static readonly BEGINNING_OF_SUNSET: number = 12000
    private static readonly BEGINNING_OF_NIGHT: number = 13000
    private static readonly BEGINNING_OF_SUNRISE: number = 23000
    private static readonly BEGINNING_OF_DAY: number = 24000
    private static readonly sunset = createLinearFunction(this.BEGINNING_OF_SUNSET, 0.0,
        this.BEGINNING_OF_NIGHT, 1.0)
    private static readonly sunrise = createLinearFunction(this.BEGINNING_OF_SUNRISE, 1.0,
        this.BEGINNING_OF_DAY, 0.0);
    private static readonly MAX_FOOD: number = 20
    private static readonly MAX_FOOD_SATURATION: number = 20
    private static readonly MAX_HEALTH: number = 20

    private static readonly difficultyMap: { [key: string]: number } = {
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
    private static readonly moonPhaseDifficultyMap: { [key: number]: number } = {
        '0': 1,
        '1': 0.75,
        '2': 0.5,
        '3': 0.25,
        '4': 0,
        '5': 0.25,
        '6': 0.5,
        '7': 0.75
    }


    private static time(timeOfDay: number) {
        if (this.BEGINNING_OF_SUNSET < timeOfDay && timeOfDay <= this.BEGINNING_OF_NIGHT) {
            return this.sunset(timeOfDay)
        } else if (this.BEGINNING_OF_NIGHT < timeOfDay && timeOfDay <= this.BEGINNING_OF_SUNRISE) {
            return 1.0
        } else if (this.BEGINNING_OF_SUNRISE < timeOfDay && timeOfDay <= this.BEGINNING_OF_DAY) {
            return this.sunrise(timeOfDay)
        } else {
            return 0.0
        }
    }

    /**
     * 返回 0~1 之间的常数，用以代表恐惧向量
     * [难度，饥饿值，饱和度，生命值，月相，时间]
     */
    public static getFearVector(): Array<number> {
        console.log(bot.food)
        return [
            this.difficultyMap[bot.game.difficulty],
            (this.MAX_FOOD - bot.food) / this.MAX_FOOD,
            (this.MAX_FOOD_SATURATION - bot.foodSaturation) / this.MAX_FOOD_SATURATION,
            (this.MAX_HEALTH - bot.health) / this.MAX_HEALTH,
            this.moonPhaseDifficultyMap[bot.time.moonPhase],
            this.time(bot.time.timeOfDay)
        ]
    }
}