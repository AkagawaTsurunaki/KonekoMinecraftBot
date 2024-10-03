import {Block} from "prismarine-block";
import {Vec3} from "vec3";
import {bot} from "../index";
import {sleep} from "../utils/sleep";
import {goto} from "../utils/helper";

export class FarmSkill {

    public readonly cropList: number[] = [
        bot.registry.blocksByName['wheat'].id,
        bot.registry.blocksByName['potatoes'].id,
        bot.registry.blocksByName['carrots'].id,
        bot.registry.blocksByName['beetroots'].id
    ]
    private readonly maturity: number = 7
    private readonly searchRadius: number = 64
    private readonly maxSearchBlocks: number = 512

    private harvestableFilter = (block: Block): boolean => {
        return block
            && this.cropList.includes(block.type)
            && block.metadata === this.maturity
    }


    private findBlockToHarvest(): Block | null {
        return bot.findBlock({
            point: bot.entity.position,
            matching: this.harvestableFilter,
            maxDistance: this.searchRadius,
            count: this.maxSearchBlocks
        })
    }


    private findBlockToSow(): Block | null {
        return bot.findBlock({
            point: bot.entity.position,
            matching: bot.registry.blocksByName['farmland'].id,
            maxDistance: this.searchRadius,
            useExtraInfo: (block) => {
                const blockAbove = bot.blockAt(block.position.offset(0, 1, 0))
                return !blockAbove || blockAbove.type === 0
            }
        })
    }


    private findBlockToFertilize(): Block | null {
        return bot.findBlock({
            point: bot.entity.position,
            maxDistance: this.searchRadius,
            matching: (block) => {
                return block && this.cropList.includes(block.type) && block.metadata < this.maturity
            }
        })
    }


    private findComposter(): Block | null {
        return bot.findBlock({
            matching: (block) => {
                return block && block.type == bot.registry.blocksByName['composter'].id
            }
        })
    }


    public async harvest(listener: () => boolean) {
        console.log(`正在收获作物`)
        while (listener()) {
            const block = this.findBlockToHarvest()
            if (block) {
                goto(block.position)
                await bot.dig(block)
                await sleep(50)
            } else {
                bot.stopDigging()
            }
        }
        console.log(`完成收获作物`)
    }


    public async sow(cropName: string, listener: () => boolean) {
        console.log(`正在种植作物`)
        while (listener()) {
            let blockToSow = this.findBlockToSow()
            if (!blockToSow) {
                break
            }
            goto(blockToSow.position.offset(0, 1, 0))
            try {
                await bot.equip(bot.registry.itemsByName[cropName].id, 'hand')
            } catch (e) {
                console.warn(`背包已无更多 ${cropName}`)
                break
            }
            try {
                await bot.placeBlock(blockToSow, new Vec3(0, 1, 0))
            } catch (e) {
                console.log(`正在搜索更多耕地……`)
            }
        }
        console.log(`完成种植作物`)
    }


    public async fertilize(listener: () => boolean) {
        console.log('正在施肥作物')

        while (listener()) {

            const blockToFertilize = this.findBlockToFertilize()

            if (!blockToFertilize) {
                break
            }
            goto(blockToFertilize.position)
            try {
                await bot.equip(bot.registry.itemsByName['bone_meal'].id, 'hand')
            } catch (ignore) {
                console.warn(`背包已无更多 bone_meal`)
                break
            }
            try {
                await bot.activateBlock(blockToFertilize)
            } catch (ignore) {
            }
        }
        console.log('完成正在施肥作物')
    }


    public async compost(itemName: string, listener: () => boolean) {
        console.log(`开始堆肥`)
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
        console.log(`完成堆肥`)
    }

}