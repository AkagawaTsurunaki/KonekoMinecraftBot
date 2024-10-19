import {getLogger} from "../../../util/logger";
import {AbstractState} from "../../abstractState";
import {Block} from "prismarine-block";
import {corpsNameList} from "../../../common/const";
import {ExtendedBot} from "../../../extension/extendedBot";
import {DbscanAlgorithm} from "../../../algorithm/dbscanAlgorithm";
import {ClustersProcessAlgorithm} from "../../../algorithm/clustersProcessAlgorithm";
import {lock} from "../../../common/decorator/lock";
import {stateDoc} from "../../../common/decorator/stateDoc";
import {BlockUpdateCognition} from "../../../cognition/blockUpdateCognition";


const logger = getLogger("HarvestState")

@stateDoc({
    name: "HarvestState",
    description: "If a player harvesting nearby, bot will also try to help harvest the crop."
})
export class HarvestState extends AbstractState {
    private clusterProcessAlgorithm: ClustersProcessAlgorithm;
    private readonly dbscanAlgorithm: DbscanAlgorithm
    private readonly harvestedIntent: BlockUpdateCognition
    private searchRadius = 16;
    private contactRadius = 5;

    constructor(bot: ExtendedBot) {
        super("HarvestState", bot)
        this.harvestedIntent = new BlockUpdateCognition(3, 10)
        this.dbscanAlgorithm = new DbscanAlgorithm(this.bot);
        this.clusterProcessAlgorithm = new ClustersProcessAlgorithm(this.bot)
    }


    getTransitionValue(): number {
        if (this.harvestedIntent.getIntent()) {
            return 1;
        }
        return 0;
    }

    onListen() {
        this.bot.on("blockUpdate", (oldBlock: Block | null, newBlock: Block) => {
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
        let corpBlocks = this.bot.skills.farm.findBlocksToHarvest(this.searchRadius, 1000)
        if (corpBlocks == null || corpBlocks.length == 0) return

        let clusters = this.dbscanAlgorithm.dbscan(corpBlocks, 1, 1)
        const vec3clusters = this.clusterProcessAlgorithm.getVec3ListFromClusters(clusters, corpBlocks);
        for (let corpBlocks of vec3clusters) {
            for (let corpBlock of corpBlocks) {
                const dist = this.bot.entity.position.distanceTo(corpBlock);
                if (dist > this.contactRadius) {
                    await this.bot.utils.tryGotoNear(corpBlock)
                }
                const corpBlock1 = this.bot.blockAt(corpBlock)
                if (corpBlock1) {
                    await this.bot.dig(corpBlock1, true);
                }
            }
        }

        this.harvestedIntent.resetIntent()
        logger.info("Harvest action finished.")
    }
}