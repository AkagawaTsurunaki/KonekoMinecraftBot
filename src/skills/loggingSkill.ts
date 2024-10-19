import {axeNameList, woodNameList} from "../common/const";
import {getLogger} from "../utils/logger";
import {AbstractSkill} from "./abstractSkill";
import {Vec3} from "vec3";
import {DbscanAlgorithm} from "../algorithm/dbscanAlgorithm";

const logger = getLogger("LoggingSkill")

export class LoggingSkill extends AbstractSkill {
    private maxSearchRadius = 128
    private maxCollectCount = 1024

    private dbscanAlgorithm = new DbscanAlgorithm(this.bot)

    private findWoodsToCollect(wood: string) {
        return this.bot.findBlocks({
            matching: block => block && block.type === this.bot.registry.blocksByName[wood].id,
            maxDistance: this.maxSearchRadius,
            count: this.maxCollectCount
        })
    }

    private async tryEquipAxe() {
        const axeTypeList = axeNameList.map(axeName => this.bot.registry.itemsByName[axeName].id)
        const heldAxeTypeList = axeTypeList.filter(axeType =>
            this.bot.inventory.findInventoryItem(axeType, null, false) != null);
        if (heldAxeTypeList.length == 0)
            return
        await this.bot.equip(heldAxeTypeList[0], 'hand')
    }

    public async logging(wood: string, stop: () => boolean) {
        if (!woodNameList.includes(wood)) {
            logger.error(`Can not find "${wood}" in wood name list: Must be one of ${woodNameList}.`)
            return
        }
        logger.info(`Logging skill executing...`)
        const woodPositions = this.findWoodsToCollect(wood);
        const clusters = this.dbscanAlgorithm.dbscan(woodPositions, 1, 1)
        for (const cluster of clusters) {
            const loggingPosList = cluster.map((index: number) => woodPositions[index])
                .sort((a: Vec3, b: Vec3) => a.y - b.y)
            for (const woodPos of loggingPosList) {
                if (stop()) {
                    this.bot.stopDigging()
                    logger.warn(`Logging skill stopped: Stop function called.`)
                    return
                }
                const woodBlock = this.bot.blockAt(woodPos)
                if (woodBlock) {
                    await this.bot.utils.tryGotoNear(woodBlock.position)
                    await this.tryEquipAxe()
                    try {
                        await this.bot.dig(woodBlock)
                    } catch (ignore) {
                    }
                }
            }
        }
        logger.info(`Logging skill finished.`)
    }

}