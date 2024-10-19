import {AbstractState} from "../../abstractState";
import {clamp, createLinearFunction} from "../../../utils/math";
import {BEGINNING_OF_DAY, BEGINNING_OF_NIGHT, BEGINNING_OF_SUNRISE, BEGINNING_OF_SUNSET} from "../../../common/const";
import {ExtendedBot} from "../../../extension/extendedBot";
import {lock} from "../../../common/decorator/lock";
import {stateDoc} from "../../../common/decorator/stateDoc";


@stateDoc({
    name: "SleepState",
    description: "Based on information such as time and nearest bed, look for a bed to spend the night.",
    issue: "Instead of going through the door, it is possible to enter the room in search of a bed by breaking blocks."
})
export class SleepState extends AbstractState {

    constructor(bot: ExtendedBot) {
        super("SleepState", bot);
    }

    private searchRadius: number = 64
    private readonly sunsetToMidnight = createLinearFunction(BEGINNING_OF_SUNSET, 0.2, BEGINNING_OF_NIGHT, 1)
    private readonly midnightToSunrise = createLinearFunction(BEGINNING_OF_SUNRISE, 1, BEGINNING_OF_DAY, 0.2,)

    private time(): number {
        const timeOfDay = this.bot.time.timeOfDay;
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
        return 0
    }


    getTransitionValue(): number {
        const timeVal = this.time()
        if (this.bot.skills.sleep.findBedBlock(this.searchRadius, 1)) {
            return clamp(timeVal, 0, 1) * (timeVal === 0 ? 0 : 1)
        }
        return 0
    }

    @lock()
    async onUpdate() {
        super.onUpdate();
        await this.bot.skills.sleep.gotoSleep(this.searchRadius, 1)
    }

}