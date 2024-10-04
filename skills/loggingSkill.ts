import {dbscan} from "../algorithm/dbscan";
import {bot} from "../index";
import {tryGotoNear} from "../utils/helper";

export class LoggingSkill {
    private static maxSearchRadius = 128
    private static maxCollectCount = 1024
    private static readonly woodNameList: string[] = ['cherry_log', 'oak_log', 'dark_oak_log', 'spruce_log', 'birch_log', 'jungle_log', 'acacia_log', 'mangrove_log']
    private static readonly axeNameList: string[] = ['diamond_axe', 'iron_axe', 'stone_axe', 'wooden_axe', 'golden_axe', 'netherite_axe']

    private static findWoodsToCollect(wood: string) {
        return bot.findBlocks({
            matching: block => block && block.type === bot.registry.blocksByName[wood].id,
            maxDistance: this.maxSearchRadius,
            count: this.maxCollectCount
        })
    }

    private static async tryEquipAxe() {
        const axeTypeList = this.axeNameList.map(axeName => bot.registry.itemsByName[axeName].id)
        const heldAxeTypeList = axeTypeList.filter(axeType =>
            bot.inventory.findInventoryItem(axeType, null, false) != null);
        if (heldAxeTypeList.length == 0)
            return
        await bot.equip(heldAxeTypeList[0], 'hand')
    }

    public static async logging(wood: string, stop: () => boolean) {
        if (!this.woodNameList.includes(wood)) {
            console.error(`无法找到目标原木 ${wood}`)
            return
        }
        console.log(`正在伐木……`)
        const woodPositions = this.findWoodsToCollect(wood);
        const clusters = dbscan(woodPositions, 1, 1)
        for (const cluster of clusters) {
            const loggingPosList = cluster.map(index => woodPositions[index])
                .sort((a, b) => a.y - b.y)
            for (const woodPos of loggingPosList) {
                if (stop()) {
                    bot.stopDigging()
                    console.log(`中止伐木`)
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
        console.log('结束伐木')
    }

}