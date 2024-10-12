import {AbstractState} from "../fsm";
import {BlockUpdateIntent} from "../../intent/blockUpdateIntent";
import {FarmSkill} from "../../skills/farmSkill";
import {dbscan} from "../../algorithm/dbscan";
import {getVec3ListFromClusters} from "../../algorithm/clustersProcessAlgorithm";
import {bot} from "../../../index";
import {tryGotoNear} from "../../utils/helper";
import {lock} from "../../common/decorator";
import {Block} from "prismarine-block";
import {corpsNameList} from "../../common/const";
import {getLogger} from "../../utils/log";


const logger = getLogger("HarvestState")

export class HarvestState extends AbstractState {

    constructor() {
        super("HarvestState");
        this.harvestedIntent = new BlockUpdateIntent(3, 10)
    }

    private readonly harvestedIntent: BlockUpdateIntent
    private searchRadius = 16;
    private contactRadius = 5;

    getTransitionValue(): number {
        if (this.harvestedIntent.getIntent()) {
            return 1;
        }
        return 0;
    }

    onListen() {
        bot.on("blockUpdate", (oldBlock: Block | null, newBlock: Block) => {
            if (oldBlock && newBlock) {
                // 作物被收割了
                if (corpsNameList.includes(oldBlock.name) && newBlock.name.includes("air")) {
                    this.harvestedIntent.setIntent()
                }
            }
        })
    }

    @lock()
    async onUpdate() {
        super.onUpdate();
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
                if (corpBlock1) {
                    await bot.dig(corpBlock1, true);
                }
            }
        }

        this.harvestedIntent.resetIntent()
        bot.chat("收割完毕喵~")
        logger.info("Harvest action finished.")
    }
}