import {stateDoc} from "../../../common/decorator/stateDoc";
import {AbstractState} from "../../abstractState";
import {ExtendedBot} from "../../../extension/extendedBot";
import {Chest, Dispenser} from "mineflayer";
import {getLogger} from "../../../util/logger";
import {range} from "../../../common/decorator/range";
import {lock} from "../../../common/decorator/lock";
import {enableSearchForChestState, setEnableSearchForChestState, targetItemNameMap} from "./searchResourceState";
import {maxDistanceAmong, minDistanceAmong} from "../../../util/distUtil";
import {clamp, dot} from "../../../util/math";

const logger = getLogger("SearchForChestState")

@stateDoc({
    name: "SearchForChestState",
    description: "In search radius, try to search around chest and find the specific items. Maintain a cache to remember where chests are and what items included. If cached chest is changed, then updated it.",
    issue: "We suppose target items are not in the inventory."
})
export class SearchForChestState extends AbstractState {
    constructor(bot: ExtendedBot) {
        super("SearchForChestState", bot);
    }

    private readonly maxChestDistance: number = 100
    private readonly minChestDistance: number = 32

    @range(0, 1)
    getTransitionValue(): number {
        if (!enableSearchForChestState) return 0
        if (targetItemNameMap.size > 0) {
            const chestPositions = this.bot.skills.findChest.findCachedChestsIncludingItems(targetItemNameMap);
            if (chestPositions) {
                const minDistanceAmongChests = minDistanceAmong(chestPositions, this.bot.entity.position);
                const maxDistanceAmongChests = maxDistanceAmong(chestPositions, this.bot.entity.position);

                const s = clamp((maxDistanceAmongChests - minDistanceAmongChests) / maxDistanceAmongChests, 0, 1)
                const near = minDistanceAmongChests < this.minChestDistance ? 1 : 0
                const remote = maxDistanceAmongChests < this.maxChestDistance ? 1 : 0

                return dot([0.5, 0.25, 0.25],
                    [s, near, remote])
            }
        }
        return 0
    }

    onListen() {
        super.onListen();
    }

    @lock()
    async onUpdate() {
        super.onUpdate();
        let chestPositions = this.bot.skills.findChest.findCachedChestsIncludingItems(targetItemNameMap)
        if (!chestPositions || chestPositions.length == 0) {
            // If bot does not find the target item in chest list in memory.
            chestPositions = this.bot.skills.findChest.searchChestAround()
        }

        if (!chestPositions) return;

        // If bot know the position of the chest and include item
        for (const pos of chestPositions) {
            logger.debug("Number of chests around:" + chestPositions.length)
            const chestBlock = await this.bot.skills.findChest.goNearToCheckChest(pos);
            if (chestBlock) {
                // Confirm has chestBlock
                const chest = await this.bot.skills.findChest.openChest(chestBlock);
                if (!chest) continue

                await this.takeTargetItems(chest)
                this.bot.skills.findChest.updateChestCache(chestBlock.position, chest)
                chest.close()
            }
        }
        setEnableSearchForChestState(false)
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


    onExit() {
        super.onExit();
    }
}