import {getLogger} from "../../../utils/logger";
import {AbstractState} from "../../abstractState";
import {BlockUpdateIntent} from "../../../intent/blockUpdateIntent";
import {bot} from "../../../../index";
import {Block} from "prismarine-block";
import {corpsNameList} from "../../../common/const";
import {lock} from "../../../common/decorator";
import {FarmSkill} from "../../../skills/farmSkill";
import {dbscan} from "../../../algorithm/dbscan";
import {getVec3ListFromClusters} from "../../../algorithm/clustersProcessAlgorithm";
import {tryGotoNear} from "../../../utils/helper";
import {stateDoc} from "../../../decorator/stateDoc";


const logger = getLogger("HarvestState")

@stateDoc({
    name: "HarvestState",
    description: "If a player harvesting nearby, bot will also try to help harvest the crop."
})
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
                // A block (corp) was broken.
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
        logger.info("Harvest action finished.")
    }
}