import {dbscan} from "../algorithm/dbscan";
import {bot} from "../../index";
import {tryGotoNear} from "../utils/helper";
import {axeNameList, woodNameList} from "../common/const";
import {getLogger} from "../utils/log";


const logger = getLogger("LoggingSkill")


export class LoggingSkill {
    private static maxSearchRadius = 128
    private static maxCollectCount = 1024

    private static findWoodsToCollect(wood: string) {
        return bot.findBlocks({
            matching: block => block && block.type === bot.registry.blocksByName[wood].id,
            maxDistance: this.maxSearchRadius,
            count: this.maxCollectCount
        })
    }

    private static async tryEquipAxe() {
        const axeTypeList = axeNameList.map(axeName => bot.registry.itemsByName[axeName].id)
        const heldAxeTypeList = axeTypeList.filter(axeType =>
            bot.inventory.findInventoryItem(axeType, null, false) != null);
        if (heldAxeTypeList.length == 0)
            return
        await bot.equip(heldAxeTypeList[0], 'hand')
    }

    public static async logging(wood: string, stop: () => boolean) {
        if (!woodNameList.includes(wood)) {
            logger.error(`Can not find "${wood}" in wood name list: Must be one of ${woodNameList}.`)
            return
        }
        logger.info(`Logging skill executing...`)
        const woodPositions = this.findWoodsToCollect(wood);
        const clusters = dbscan(woodPositions, 1, 1)
        for (const cluster of clusters) {
            const loggingPosList = cluster.map(index => woodPositions[index])
                .sort((a, b) => a.y - b.y)
            for (const woodPos of loggingPosList) {
                if (stop()) {
                    bot.stopDigging()
                    logger.warn(`Logging skill stopped: Stop function called.`)
                    return
                }
                const woodBlock = bot.blockAt(woodPos)
                if (woodBlock) {
                    await tryGotoNear(woodBlock.position)
                    await this.tryEquipAxe()
                    try {
                        await bot.dig(woodBlock)
                    } catch (ignore) {
                    }
                }
            }
        }
        logger.info(`Logging skill finished.`)
    }

}