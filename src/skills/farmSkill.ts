import {Block} from "prismarine-block";
import {Vec3} from "vec3";
import {bot} from "../../index";
import {sleep} from "../utils/sleep";
import {goto, tryGotoNear} from "../utils/helper";
import {corpsNameList} from "../common/const";
import {getLogger} from "../utils/logger";


const logger = getLogger("SleepSkill")


export class FarmSkill {

    private static readonly maturity: number = 7

    private static harvestableFilter = (block: Block): boolean => {
        const cropList = corpsNameList.map(corpName => bot.registry.blocksByName[corpName].id)
        return block
            && cropList.includes(block.type)
            && block.metadata === this.maturity
    }

    public static findBlockToHarvest(maxDistance: number, count: number): Block | null {
        return bot.findBlock({
            point: bot.entity.position,
            matching: this.harvestableFilter,
            maxDistance: maxDistance,
            count: count
        })
    }

    public static findBlocksToHarvest(maxDistance: number, count: number): Vec3[] {
        return bot.findBlocks({
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

    public static async harvest(searchRadius: number, count: number, contactRadius: number, stop: () => boolean) {
        const corpPosList = FarmSkill.findBlocksToHarvest(searchRadius, count)
        if (corpPosList) {
            try {
                for (let corpPos of corpPosList) {
                    const dist = bot.entity.position.distanceTo(corpPos);
                    if (dist > contactRadius) {
                        await tryGotoNear(corpPos)
                    }
                    const corpBlock = bot.blockAt(corpPos)
                    if (corpBlock) {
                        await bot.dig(corpBlock, true);
                    }
                }
            } catch (e: any) {
                logger.error(`Can not harvest because: ${e.message}`)
            }
        }
    }


    public static async sow(maxDistance: number, cropName: string, stop: () => boolean) {
        logger.info(`Sowing...`)
        while (!stop()) {
            let blockToSow = this.findBlockToSow(maxDistance)
            if (!blockToSow) {
                break
            }
            goto(blockToSow.position.offset(0, 1, 0))
            try {
                await bot.equip(bot.registry.itemsByName[cropName].id, 'hand')
            } catch (e) {
                logger.warn(`No more "${cropName}" to sow.`)
                break
            }
            try {
                await bot.placeBlock(blockToSow, new Vec3(0, 1, 0))
            } catch (e) {
                logger.warn(`Waiting for searching for more blocks to sow...`)
            }
        }
        logger.info(`Sowing finished.`)
    }


    public static async fertilize(maxDistance: number, stop: () => boolean) {
        logger.info('Fertilizing...')

        while (!stop()) {

            const blockToFertilize = this.findBlockToFertilize(maxDistance)

            if (!blockToFertilize) {
                break
            }
            goto(blockToFertilize.position)
            try {
                await bot.equip(bot.registry.itemsByName['bone_meal'].id, 'hand')
            } catch (ignore) {
                logger.warn(`No more "bone_meal" to fertilize.`)
                break
            }
            try {
                await bot.activateBlock(blockToFertilize)
            } catch (ignore) {
            }
        }
        logger.info('Fertilizing finished.')
    }


    public static async compost(itemName: string, listener: () => boolean) {
        logger.info(`Composting...`)

        const composterBlock = this.findComposter()
        while (listener()) {
            if (composterBlock) {
                goto(composterBlock.position)
                try {
                    await bot.equip(bot.registry.itemsByName[itemName].id, 'hand')
                } catch (ignore) {
                    logger.warn(`No more "${itemName}" to compost.`)
                    break
                }
                await sleep(200)
                try {
                    await bot.activateBlock(composterBlock)
                } catch (ignore) {
                }
            }
        }

        logger.info('Composting finished.')
    }

}