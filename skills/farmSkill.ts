import {Block} from "prismarine-block";
import {Vec3} from "vec3";
import {bot} from "../index";
import {sleep} from "../utils/sleep";
import {goto} from "../utils/helper";
import {corpsNameList} from "../const";
import {log, warn} from "../utils/log";

export class FarmSkill {

    private static readonly maturity: number = 7

    private static harvestableFilter = (block: Block): boolean => {
        const cropList = corpsNameList.map(corpName => bot.registry.blocksByName[corpName].id)
        return block
            && cropList.includes(block.type)
            && block.metadata === this.maturity
    }

    private static findBlockToHarvest(maxDistance: number, count: number): Block | null {
        return bot.findBlock({
            point: bot.entity.position,
            matching: this.harvestableFilter,
            maxDistance: maxDistance,
            count: count
        })
    }

    private static findBlockToSow(maxDistance: number): Block | null {
        return bot.findBlock({
            point: bot.entity.position,
            matching: bot.registry.blocksByName['farmland'].id,
            maxDistance: maxDistance,
            useExtraInfo: (block) => {
                const blockAbove = bot.blockAt(block.position.offset(0, 1, 0))
                return !blockAbove || blockAbove.type === 0
            }
        })
    }


    private static findBlockToFertilize(maxDistance: number): Block | null {
        return bot.findBlock({
            point: bot.entity.position,
            maxDistance: maxDistance,
            matching: (block) => {
                return block && corpsNameList.includes(block.name) && block.metadata < this.maturity
            }
        })
    }


    private static findComposter(): Block | null {
        return bot.findBlock({
            matching: (block) => {
                return block && block.type == bot.registry.blocksByName['composter'].id
            }
        })
    }


    public static async harvest(maxDistance: number, count: number, stop: () => boolean) {
        log(`正在收获作物`)
        while (!stop()) {
            const block = this.findBlockToHarvest(maxDistance, count)
            if (block) {
                goto(block.position)
                await bot.dig(block)
                await sleep(50)
            } else {
                bot.stopDigging()
            }
        }
        log(`完成收获作物`)
    }


    public static async sow(maxDistance: number, cropName: string, stop: () => boolean) {
        log(`正在种植作物`)
        while (!stop()) {
            let blockToSow = this.findBlockToSow(maxDistance)
            if (!blockToSow) {
                break
            }
            goto(blockToSow.position.offset(0, 1, 0))
            try {
                await bot.equip(bot.registry.itemsByName[cropName].id, 'hand')
            } catch (e) {
                warn(`背包已无更多 ${cropName}`)
                break
            }
            try {
                await bot.placeBlock(blockToSow, new Vec3(0, 1, 0))
            } catch (e) {
                warn(`正在搜索更多耕地……`)
            }
        }
        log(`完成种植作物`)
    }


    public static async fertilize(maxDistance: number, stop: () => boolean) {
        log('正在施肥作物')

        while (!stop()) {

            const blockToFertilize = this.findBlockToFertilize(maxDistance)

            if (!blockToFertilize) {
                break
            }
            goto(blockToFertilize.position)
            try {
                await bot.equip(bot.registry.itemsByName['bone_meal'].id, 'hand')
            } catch (ignore) {
                warn(`背包已无更多 bone_meal`)
                break
            }
            try {
                await bot.activateBlock(blockToFertilize)
            } catch (ignore) {
            }
        }
        log('完成正在施肥作物')
    }


    public static async compost(itemName: string, listener: () => boolean) {
        log(`开始堆肥`)
        const composterBlock = this.findComposter()
        while (listener()) {
            if (composterBlock) {
                goto(composterBlock.position)
                try {
                    await bot.equip(bot.registry.itemsByName[itemName].id, 'hand')
                } catch (ignore) {
                    console.warn(`背包已无更多 ${itemName}`)
                    break
                }
                await sleep(200)
                try {
                    await bot.activateBlock(composterBlock)
                } catch (ignore) {
                }
            }
        }
        log(`完成堆肥`)
    }

}