import {AbstractState} from "./fsm";
import {Block} from "prismarine-block";
import {Entity} from "prismarine-entity";
import {bot} from "../index";
import {isMaster} from "../utils/helper";
import {LimitedArray} from "../utils/limitArray";
import {getTimeDiff} from "../utils/math";
import {debug, warn} from "../utils/log";
import {corpsNameList} from "../const";

class BreakBlockIntent {
    private readonly blockNames: string[]
    private readonly blockBreakProgressEndEvents: LimitedArray<Date>
    private readonly continuousDiggingCount: number
    private readonly continuousDiggingTime: number

    constructor(blockNames: string[], continuousDiggingCount: number, continuousDiggingTime: number) {
        this.blockNames = blockNames
        this.continuousDiggingCount = continuousDiggingCount
        this.continuousDiggingTime = continuousDiggingTime
        this.blockBreakProgressEndEvents = new LimitedArray(this.continuousDiggingCount);
        this.eventRegister()
    }

    public intent(): boolean {
        const events = this.blockBreakProgressEndEvents.getArray();
        if (events.length < this.continuousDiggingCount) {
            return false
        }
        const timeDiff = getTimeDiff(events[0], events[events.length - 1]);
        return timeDiff <= this.continuousDiggingTime;
    }

    private eventRegister() {
        // @ts-ignore
        bot.on("blockBreakProgressEnd", (block: Block, entity: Entity) => {
            if (this.blockNames.includes(block.name)) {
                debug(block, true)
                if (isMaster(entity)) {
                    this.blockBreakProgressEndEvents.add(new Date())
                    warn("Detected", true)
                }
            }
        })
    }
}

export class HarvestState extends AbstractState {
    private readonly breakBlockIntent: BreakBlockIntent

    constructor() {
        super("收获状态");
        this.breakBlockIntent = new BreakBlockIntent(corpsNameList, 3, 30)
    }

    getCondVal(): number {
        if (this.breakBlockIntent.intent()) {
            return 1;
        }
        return 0;
    }

    onEntered() {
        console.warn('Starting...')
    }

    onExited() {

    }

    onUpdate(...args: any[]) {
    }

}