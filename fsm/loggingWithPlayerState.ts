import {AbstractState} from "./fsm";
import {bot} from "../index";
import {Block} from "prismarine-block";
import {LimitedArray} from "../utils/limitArray";
import {getTimeDiff} from "../utils/math";
import {LoggingSkill} from "../skills/loggingSkill";
import {Entity} from "prismarine-entity";

export class LoggingWithPlayerState extends AbstractState {
    private readonly limitedRecSize = 3
    private logBlockRec: LimitedArray<Date> = new LimitedArray(this.limitedRecSize)
    private readonly loggingDiff: number = 30
    private lastLoggedLogBlock: string = null
    private startLoggingTime: Date = null
    private maxLoggingTime = 300;
    private loggingUsername: string;
    private finished = false

    constructor() {
        super("伐木状态");
    }

    getCondVal(): number {
        /// 周围有至少一个玩家在30秒内砍伐原木超过3个。
        /// 周围有至少一个玩家在砍伐原木后，看向了机器人所在的访问
        const arr = this.logBlockRec.getArray()
        if (arr.length !== this.limitedRecSize) {
            return 0.0
        }
        const start = arr[0]
        const end = arr[this.limitedRecSize - 1]
        const timeDiff = getTimeDiff(start, end);
        if (this.finished) return 0
        if (timeDiff < this.loggingDiff) {
            return Math.abs(timeDiff - this.loggingDiff) / this.loggingDiff
        }
    }

    async onEntered() {
        if (this.isEntered) return
        if (this.lastLoggedLogBlock == null) return
        this.isEntered = true
        this.startLoggingTime = new Date()
        await LoggingSkill.logging(this.lastLoggedLogBlock, () => {
            return getTimeDiff(this.startLoggingTime, new Date()) > this.maxLoggingTime
        })
        this.lastLoggedLogBlock = null
        this.logBlockRec.clear()
        this.finished = true
    }

    onExited() {
        this.isEntered = false
        this.finished = false
    }

    onUpdate(...args: any[]) {
        // @ts-ignore
        bot.on("blockBreakProgressEnd", (block: Block, entity: Entity) => {
            console.log(block)
            if (entity.type === "player") {
                if (entity.username === bot.username) return
                if (entity.username !== this.loggingUsername) {
                    this.loggingUsername = entity.username
                    this.logBlockRec.clear()
                }
                const now = new Date()
                this.logBlockRec.add(now)
                this.lastLoggedLogBlock = block.name
            }
        })
    }

}