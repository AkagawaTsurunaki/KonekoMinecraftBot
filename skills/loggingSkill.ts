import {dbscan} from "../algorithm/dbscan";
import {bot} from "../index";
import {gotoNear} from "../utils/helper";

export class LoggingSkill {
    private maxSearchRadius = 128
    private maxCollectCount = 1024
    private readonly woodNameList: string[] = ['cherry_log', 'oak_log', 'dark_oak_log', 'spruce_log', 'birch_log', 'jungle_log', 'acacia_log', 'mangrove_log']
    private readonly axeTypeList: number[] = [
        bot.registry.itemsByName['diamond_axe'].id,
        bot.registry.itemsByName['iron_axe'].id,
        bot.registry.itemsByName['stone_axe'].id,
        bot.registry.itemsByName['wooden_axe'].id,
        bot.registry.itemsByName['golden_axe'].id,
        bot.registry.itemsByName['netherite_axe'].id
    ]

    private findWoodsToCollect(wood: string) {
        return bot.findBlocks({
            matching: block => block && block.type === bot.registry.blocksByName[wood].id,
            maxDistance: this.maxSearchRadius,
            count: this.maxCollectCount
        })
    }


    private async tryEquipAxe() {
        const heldAxeTypeList = this.axeTypeList.filter(axeType =>
            bot.inventory.findInventoryItem(axeType, null, false) != null);
        if (heldAxeTypeList.length == 0)
            return
        await bot.equip(heldAxeTypeList[0], 'hand')
    }

    public async collect(wood: string) {
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
                const woodBlock = bot.blockAt(woodPos)
                if (woodBlock) {
                    await gotoNear(woodBlock.position)
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