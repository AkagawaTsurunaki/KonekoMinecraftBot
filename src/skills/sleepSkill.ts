import {Block} from "prismarine-block";
import {sleep} from "../utils/sleep";
import {getLogger} from "../utils/logger";
import {AbstractSkill} from "./abstractSkill";

const logger = getLogger("SleepSkill")

export class SleepSkill extends AbstractSkill {

    public findBedBlock(searchRadius: number, count: number) {
        return this.bot.findBlock({
            point: this.bot.entity.position,
            matching: (block: Block) => block && block.name.includes("bed"),
            maxDistance: searchRadius,
            count: count
        })
    }

    public async gotoSleep(searchRadius: number, count: number, maxTry = 5) {
        logger.info(`Sleep skill executing...`)
        try {
            const bedBlock = this.findBedBlock(searchRadius, count);
            if (bedBlock == null) {
                logger.warn("Sleep skill stopped: Can not find any bed block nearby.")
                return
            }
            await this.bot.utils.tryGotoNear(bedBlock.position)

            logger.info(`Found the bed, ready to sleep.`)
            let tryCount = 0
            while (!this.bot.isSleeping) {
                await this.bot.sleep(bedBlock)
                await sleep(50)
                tryCount += 1
                if (tryCount > maxTry) {
                    logger.info(`Sleeping terminated.`)
                    return
                }
            }
            logger.info("Bot awaken.")
        } catch (e: any) {
            logger.error(`Can not sleep because: ${e.message}`)
        }
    }
}