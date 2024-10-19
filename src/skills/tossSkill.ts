import {itemByName} from "../utils/helper";
import {bot} from "../../index";
import {getLogger} from "../utils/logger";

const logger = getLogger("TossSkill")

export class TossSkill {
    public async tossItem(itemName: string, amount: number | null) {
        const item = itemByName(itemName)
        if (!item) {
            logger.warn(`No item in the inventory: ${itemName}`)
        } else {
            try {
                if (amount) {
                    await bot.toss(item.type, null, amount)
                    logger.info(`Tossed ${amount} x ${itemName}`)
                } else {
                    await bot.tossStack(item)
                    logger.info(`Tossed ${itemName}`)
                }
            } catch (e: any) {
                logger.error(`Unable to toss: ${e.message}`)
            }
        }
    }
}
