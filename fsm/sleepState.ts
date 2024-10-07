import {AbstractState} from "./fsm";
import {SleepSkill} from "../skills/sleepSkill";
import {bot} from "../index";
import {clamp, createLinearFunction} from "../utils/math";
import {BEGINNING_OF_DAY, BEGINNING_OF_NIGHT, BEGINNING_OF_SUNRISE, BEGINNING_OF_SUNSET} from "../const";

export class SleepState extends AbstractState {

    private searchRadius: number = 64
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

    constructor() {
        super("睡眠状态");
    }

    getCondVal(): number {
        const timeVal = this.time()
        if (SleepSkill.findBedBlock(this.searchRadius, 1)) {
            return clamp(timeVal, 0, 1) * (timeVal === 0 ? 0 : 1)
        }
        return 0
    }

    async onEntered() {
        if (this.isEntered) return
        this.isEntered = true
        await SleepSkill.gotoSleep(this.searchRadius, 1)
        this.isEntered = false
    }

    onExited() {
        this.isEntered = false
    }

    onUpdate(...args: any[]) {
    }

}