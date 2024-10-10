import {AbstractState} from "./fsm";
import {Block} from "prismarine-block";
import {bot} from "../index";
import {LimitedArray} from "../utils/limitArray";
import {getTimeDiff} from "../utils/math";
import {corpsNameList} from "../const";
import {FarmSkill} from "../skills/farmSkill";
import {log} from "../utils/log";
import {tryGotoNear} from "../utils/helper";
import {dbscan} from "../algorithm/dbscan";
import {getVec3ListFromClusters} from "../algorithm/clustersProcessAlgorithm";

abstract class BlockUpdateIntent {
    protected readonly blockBreakProgressEndEvents: LimitedArray<Date>
    protected readonly continuousDiggingCount: number
    protected readonly continuousDiggingTime: number

    constructor(continuousDiggingCount: number, continuousDiggingTime: number) {
        this.continuousDiggingCount = continuousDiggingCount
        this.continuousDiggingTime = continuousDiggingTime
        this.blockBreakProgressEndEvents = new LimitedArray(this.continuousDiggingCount);
    }

    public intent(): boolean {
        const events = this.blockBreakProgressEndEvents.getArray();
        if (events.length < this.continuousDiggingCount) {
            return false
        }
        const timeDiff = getTimeDiff(events[0], events[events.length - 1]);
        return timeDiff <= this.continuousDiggingTime;
    }

    public startEventListeners() {
        bot.world.on("blockUpdate", (oldBlock: Block | null, newBlock: Block) => {
            this.eventListener(oldBlock, newBlock)
        })
    }

    public reset() {
        this.blockBreakProgressEndEvents.clear()
    }

    protected abstract eventListener(oldBlock: Block | null, newBlock: Block)
}

class HarvestIntent extends BlockUpdateIntent {
    protected eventListener(oldBlock: Block | null, newBlock: Block) {
        if (oldBlock && newBlock) {
            // 作物被收割了
            if (corpsNameList.includes(oldBlock.name) && newBlock.name.includes("air")) {
                this.blockBreakProgressEndEvents.add(new Date())
            }
        }
    }
}

export class HarvestState extends AbstractState {
    private readonly harvestedIntent: BlockUpdateIntent
    private searchRadius = 128;
    private contactRadius = 5;

    constructor() {
        super("收获状态");
        this.harvestedIntent = new HarvestIntent(3, 30)
        this.harvestedIntent.startEventListeners()
    }

    getCondVal(): number {
        if (this.harvestedIntent.intent()) {
            return 1;
        }
        return 0;
    }

    async onEnter() {
        if (this.isEntered) return
        this.isEntered = true

        let corpBlocks = FarmSkill.findBlocksToHarvest(this.searchRadius, 1000)
        if (corpBlocks == null || corpBlocks.length == 0) return

        let clusters = dbscan(corpBlocks, 1, 1)
        const vec3clusters = getVec3ListFromClusters(clusters, corpBlocks);
        for (let corpBlocks of vec3clusters) {
            for (let corpBlock of corpBlocks) {
                const dist = bot.entity.position.distanceTo(corpBlock);
                if (dist > this.contactRadius) {
                    await tryGotoNear(corpBlock)
                }
                const corpBlock1 = bot.blockAt(corpBlock)
                await bot.dig(corpBlock1, true);
            }
        }

        log(`完成收割作物`)
        this.isEntered = false
        this.harvestedIntent.reset()
    }

    onExit() {
        this.isEntered = false
    }

    onUpdate(...args: any[]) {
    }

}