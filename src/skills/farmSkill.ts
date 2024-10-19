import {Block} from "prismarine-block";
import {Vec3} from "vec3";
import {sleep} from "../utils/sleep";
import {corpsNameList} from "../common/const";
import {getLogger} from "../utils/logger";
import {AbstractSkill} from "./abstractSkill";


const logger = getLogger("SleepSkill")


export class FarmSkill extends AbstractSkill {

    private readonly maturity: number = 7

    private harvestableFilter = (block: Block): boolean => {
        const cropList = corpsNameList.map(corpName => this.bot.registry.blocksByName[corpName].id)
        return block
            && cropList.includes(block.type)
            && block.metadata === this.maturity
    }

    public findBlockToHarvest(maxDistance: number, count: number): Block | null {
        return this.bot.findBlock({
            point: this.bot.entity.position,
            matching: this.harvestableFilter,
            maxDistance: maxDistance,
            count: count
        })
    }

    public findBlocksToHarvest(maxDistance: number, count: number): Vec3[] {
        return this.bot.findBlocks({
            point: this.bot.entity.position,
            matching: this.harvestableFilter,
            maxDistance: maxDistance,
            count: count
        })
    }

    private findBlockToSow(maxDistance: number): Block | null {
        return this.bot.findBlock({
            point: this.bot.entity.position,
            matching: this.bot.registry.blocksByName['farmland'].id,
            maxDistance: maxDistance,
            useExtraInfo: (block) => {
                const blockAbove = this.bot.blockAt(block.position.offset(0, 1, 0))
                return !blockAbove || blockAbove.type === 0
            }
        })
    }


    private findBlockToFertilize(maxDistance: number): Block | null {
        return this.bot.findBlock({
            point: this.bot.entity.position,
            maxDistance: maxDistance,
            matching: (block) => {
                return block && corpsNameList.includes(block.name) && block.metadata < this.maturity
            }
        })
    }


    private findComposter(): Block | null {
        return this.bot.findBlock({
            matching: (block) => {
                return block && block.type == this.bot.registry.blocksByName['composter'].id
            }
        })
    }

    public async harvest(searchRadius: number, count: number, contactRadius: number, stop: () => boolean) {
        const corpPosList = this.findBlocksToHarvest(searchRadius, count)
        if (corpPosList) {
            try {
                for (let corpPos of corpPosList) {
                    const dist = this.bot.entity.position.distanceTo(corpPos);
                    if (dist > contactRadius) {
                        await this.bot.utils.tryGotoNear(corpPos)
                    }
                    const corpBlock = this.bot.blockAt(corpPos)
                    if (corpBlock) {
                        await this.bot.dig(corpBlock, true);
                    }
                }
            } catch (e: any) {
                logger.error(`Can not harvest because: ${e.message}`)
            }
        }
    }


    public async sow(maxDistance: number, cropName: string, stop: () => boolean) {
        logger.info(`Sowing...`)
        while (!stop()) {
            let blockToSow = this.findBlockToSow(maxDistance)
            if (!blockToSow) {
                break
            }
            this.bot.utils.goto(blockToSow.position.offset(0, 1, 0))
            try {
                await this.bot.equip(this.bot.registry.itemsByName[cropName].id, 'hand')
            } catch (e) {
                logger.warn(`No more "${cropName}" to sow.`)
                break
            }
            try {
                await this.bot.placeBlock(blockToSow, new Vec3(0, 1, 0))
            } catch (e) {
                logger.warn(`Waiting for searching for more blocks to sow...`)
            }
        }
        logger.info(`Sowing finished.`)
    }


    public async fertilize(maxDistance: number, stop: () => boolean) {
        logger.info('Fertilizing...')

        while (!stop()) {

            const blockToFertilize = this.findBlockToFertilize(maxDistance)

            if (!blockToFertilize) {
                break
            }
            this.bot.utils.goto(blockToFertilize.position)
            try {
                await this.bot.equip(this.bot.registry.itemsByName['bone_meal'].id, 'hand')
            } catch (ignore) {
                logger.warn(`No more "bone_meal" to fertilize.`)
                break
            }
            try {
                await this.bot.activateBlock(blockToFertilize)
            } catch (ignore) {
            }
        }
        logger.info('Fertilizing finished.')
    }


    public async compost(itemName: string, listener: () => boolean) {
        logger.info(`Composting...`)

        const composterBlock = this.findComposter()
        while (listener()) {
            if (composterBlock) {
                this.bot.utils.goto(composterBlock.position)
                try {
                    await this.bot.equip(this.bot.registry.itemsByName[itemName].id, 'hand')
                } catch (ignore) {
                    logger.warn(`No more "${itemName}" to compost.`)
                    break
                }
                await sleep(200)
                try {
                    await this.bot.activateBlock(composterBlock)
                } catch (ignore) {
                }
            }
        }

        logger.info('Composting finished.')
    }

}