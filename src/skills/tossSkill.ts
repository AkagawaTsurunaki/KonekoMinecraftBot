import {itemByName} from "../utils/helper";
import {getLogger} from "../utils/logger";
import {AbstractSkill} from "./abstractSkill";

const logger = getLogger("TossSkill")

export class TossSkill extends AbstractSkill {
    public async tossItem(itemName: string, amount: number | null) {
        const item = itemByName(itemName)
        if (!item) {
            logger.warn(`No item in the inventory: ${itemName}`)
        } else {
            try {
                if (amount) {
                    await this.bot.toss(item.type, null, amount)
                    logger.info(`Tossed ${amount} x ${itemName}`)
                } else {
                    await this.bot.tossStack(item)
                    logger.info(`Tossed ${itemName}`)
                }
            } catch (e: any) {
                logger.error(`Unable to toss: ${e.message}`)
            }
        }
    }
}
