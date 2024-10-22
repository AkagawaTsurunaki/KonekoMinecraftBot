import {AbstractSkill} from "./abstractSkill";
import {Vec3} from "vec3";
import {ExtendedMap} from "../util/mapUtil";
import {ExtendedVec3} from "../extension/extendedVec3";
import {Chest} from "mineflayer";
import {getLogger} from "../util/logger";
import {Block} from "prismarine-block";

const logger = getLogger("ChestCacheSkill")
export class FindChestSkill extends AbstractSkill {

    private chestCache = new Map<string, Map<string, number>>

    public findCachedChestsIncludingItems(targetItemNameMap: Map<string, number>): Vec3[] | null {
        const interestedChests = new ExtendedMap<string, number>()

        this.chestCache.forEach((map, posStr) => {
            targetItemNameMap.forEach((_, itemName) => {
                if (map.has(itemName)) {
                    interestedChests.setAndAdd(posStr, 1)
                }
            })
        })
        const positions = interestedChests.toKeyList().map(posStr => ExtendedVec3.fromCommaSplitString(posStr))
        logger.info(`Remembered ${positions.length} chest(s) including target items.`)
        return positions
    }

    public updateChestCache(pos: Vec3, chest: Chest) {
        const map = new Map<string, number>
        chest.items().forEach(item => {
            map.set(item.name, item.count)
        })
        this.chestCache.set(ExtendedVec3.of(pos).toCommaSplitString(), map)
    }

    public async openChest(block: Block) {
        try {
            return await this.bot.openContainer(block)
        } catch (e: any) {
            logger.error(`Error to open the chest at ${block.position.toArray()}: ${e.message}`)
            return null
        }
    }

    public searchChestAround(): Vec3[] | null {
        const blocks = this.bot.findBlocks({
            point: this.bot.entity.position,
            maxDistance: 64,
            matching: block => block.name === "chest",
            count: 100
        })
        logger.info(`Chest blocks around: ${blocks.length}`)
        return blocks
    }

    public async goNearToCheckChest(pos: Vec3): Promise<Block | null> {
        await this.bot.utils.tryGotoNear(pos)
        const blockAt = this.bot.blockAt(pos);
        if ((!blockAt) || blockAt.name !== "chest") {
            logger.warn("Where is the chest? I thought.")
            return null
        }

        return blockAt
    }


}