import {AbstractState} from "./fsm";
import {SleepSkill} from "../skills/sleepSkill";
import {bot} from "../index";
import {clamp, createLevelFuncByMap, createLinearFunction} from "../utils/math";
import {BEGINNING_OF_DAY, BEGINNING_OF_NIGHT, BEGINNING_OF_SUNRISE, BEGINNING_OF_SUNSET} from "../const";

export class SleepState extends AbstractState {

    private searchRadius: number = 64
    private distLevelFun = createLevelFuncByMap(new Map([
        [-Infinity, 1],
        [16, 1],
        [20, 0.8],
        [24, 0.5],
        [30, 0.15],
        [48, 0.05],
        [Infinity, 0]
    ]))

    private readonly sunsetToMidnight = createLinearFunction(BEGINNING_OF_SUNSET, 0.2, BEGINNING_OF_NIGHT, 1)
    private readonly midnightToSunrise = createLinearFunction(BEGINNING_OF_SUNRISE, 1, BEGINNING_OF_DAY, 0.2,)

    private time(): number {
        const timeOfDay = bot.time.timeOfDay;
        if (timeOfDay < BEGINNING_OF_SUNSET) {
            return 0
        } else if (BEGINNING_OF_SUNSET <= timeOfDay && timeOfDay < BEGINNING_OF_NIGHT) {
            return this.sunsetToMidnight(timeOfDay)
        } else if (BEGINNING_OF_NIGHT <= timeOfDay && timeOfDay < BEGINNING_OF_SUNRISE) {
            return 1.0
        } else if (BEGINNING_OF_SUNRISE <= timeOfDay && timeOfDay < BEGINNING_OF_DAY) {
            return this.midnightToSunrise(timeOfDay)
        } else if (BEGINNING_OF_DAY <= timeOfDay) {
            return 0
        }
    }

    private distToBed() {
        const bedBlock = SleepSkill.findBedBlock(this.searchRadius, 1);
        if (bedBlock == null) {
            return 0
        }
        const dist = bedBlock.position.distanceTo(bot.entity.position);
        return clamp(this.distLevelFun(dist), 0, 1);
    }

    constructor() {
        super("睡眠状态");
    }


    getCondVal(): number {
        const timeVal = this.time()
        return clamp(timeVal * 0.7 + this.distToBed() * 0.3, 0, 1) * (timeVal === 0 ? 0 : 1)
    }

    async onEntered() {
        await SleepSkill.gotoSleep(this.searchRadius, 1)
    }

    onExited() {
    }

    onUpdate(...args: any[]) {
    }

}