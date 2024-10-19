import {LimitedArray} from "../utils/limitArray";
import {getTimeDiff} from "../utils/math";

export class BlockUpdateCognition {
    protected readonly blockBreakProgressEndEvents: LimitedArray<Date>
    protected readonly continuousDiggingCount: number
    protected readonly continuousDiggingTime: number

    constructor(continuousDiggingCount: number, continuousDiggingTime: number) {
        this.continuousDiggingCount = continuousDiggingCount
        this.continuousDiggingTime = continuousDiggingTime
        this.blockBreakProgressEndEvents = new LimitedArray(this.continuousDiggingCount);
    }

    public getIntent(): boolean {
        const events = this.blockBreakProgressEndEvents.getArray();
        if (events.length < this.continuousDiggingCount) {
            return false
        }
        const timeDiff = getTimeDiff(events[0], events[events.length - 1]);
        return timeDiff <= this.continuousDiggingTime;
    }

    public setIntent() {
        this.blockBreakProgressEndEvents.add(new Date())
    }

    public resetIntent() {
        this.blockBreakProgressEndEvents.clear()
    }
}