import {stateDoc} from "../../../common/decorator/stateDoc";
import {AbstractState} from "../../abstractState";
import {ExtendedBot} from "../../../extension/extendedBot";
import {Vec3} from "vec3";
import {AutoClearZeroValueMap, ExtendedMap} from "../../../util/mapUtil";
import {ExtendedVec3} from "../../../extension/extendedVec3";
import {Block} from "prismarine-block";
import {Chest, Dispenser} from "mineflayer";
import {getLogger} from "../../../util/logger";
import {range} from "../../../common/decorator/range";
import {lock} from "../../../common/decorator/lock";

const logger = getLogger("SearchForChestState")

export const targetItemNameMap = new AutoClearZeroValueMap<string, number>()

@stateDoc({
    name: "SearchForChestState",
    description: "In search radius, try to search around chest and find the specific items. Maintain a cache to remember where chests are and what items included. If cached chest is changed, then updated it.",
    issue: "We suppose target items are not in the inventory."
})
export class SearchForChestState extends AbstractState {
    constructor(bot: ExtendedBot) {
        super("SearchForChestState", bot);
    }

    @range(0, 1)
    getTransitionValue(): number {
        if (targetItemNameMap.size > 0) {
            logger.debug(targetItemNameMap)
            return 1
        }
        return 0
    }
    
    private chestCache = new Map<string, Map<string, number>>

    onListen() {
        super.onListen();
        this.bot.events.on("masterPlainChat", (username, message) => {
            if (message === "find") {
                // test for raw beef
                targetItemNameMap.set("beef", 1)
            }
        })
    }

    @lock()
    async onUpdate() {
        super.onUpdate();
        let chestPositions = this.recallWhereTargetChest();
        if (!chestPositions || chestPositions.length == 0) {
            // If bot does not find the target item in chest list in memory.
            chestPositions = this.searchChestAround()
        }

        if (!chestPositions) return;

        // If bot know the position of the chest and include item
        for (const pos of chestPositions) {
            logger.debug("Number of chests around:" + chestPositions.length)
            const chestBlock = await this.goNearToCheckChest(pos);
            if (chestBlock) {
                // Confirm has chestBlock
                const chest = await this.openChest(chestBlock);
                if (!chest) continue

                await this.takeTargetItems(chest)
                this.updateChestCache(chestBlock.position, chest)
                chest.close()
            }
        }
    }

    private recallWhereTargetChest(): Vec3[] | null {
        const interestedChests = new ExtendedMap<string, number>()

        this.chestCache.forEach((map, posStr) => {
            targetItemNameMap.forEach((amount, itemName) => {
                if (map.has(itemName)) {
                    interestedChests.setAndAdd(posStr, 1)
                }
            })
        })
        return interestedChests.toKeyList().map(posStr => ExtendedVec3.fromCommaSplitString(posStr))
    }

    private searchChestAround(): Vec3[] | null {
        const blocks = this.bot.findBlocks({
            point: this.bot.entity.position,
            maxDistance: 64,
            matching: block => block.name === "chest",
            count: 100
        })
        logger.info(`Chest blocks around: ${blocks.length}`)
        return blocks
    }

    private async goNearToCheckChest(pos: Vec3): Promise<Block | null> {
        await this.bot.utils.tryGotoNear(pos)
        const blockAt = this.bot.blockAt(pos);
        if ((!blockAt) || blockAt.name !== "chest") {
            logger.warn("Where is the chest? I thought.")
            return null
        }

        return blockAt
    }

    private async openChest(block: Block) {
        try {
            return await this.bot.openContainer(block)
        } catch (e: any) {
            logger.error(`Error to open the chest at ${block.position.toArray()}: ${e.message}`)
            return null
        }
    }

    private async takeTargetItems(chest: Chest | Dispenser) {
        for (const [itemName, amount] of targetItemNameMap.entries()) {
            if (amount === 0) return
            if (this.bot.inventory.emptySlotCount() === 0) return;
            const itemsByNameElement = this.bot.registry.itemsByName[itemName];
            if (!itemsByNameElement) {
                logger.warn(`No such item ${itemName}`)
                return;
            }
            const id = itemsByNameElement.id;
            try {
                await chest.withdraw(id, null, amount)
                logger.info(`Withdraw ${itemName} x ${amount}`)
                targetItemNameMap.setAndAdd(itemName, -amount)
            } catch (e: any) {
                logger.error(`Can not withdraw ${itemName} x ${amount}: ${e.message}`)
            }

        }
    }

    private updateChestCache(pos: Vec3, chest: Chest) {
        const map = new Map<string, number>
        chest.items().forEach(item => {
            map.set(item.name, item.count)
        })
        this.chestCache.set(ExtendedVec3.of(pos).toCommaSplitString(), map)
    }

    onExit() {
        super.onExit();
    }
}