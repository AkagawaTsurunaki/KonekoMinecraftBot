import {bot} from "../../index";
import {Block} from "prismarine-block";
import {tryGotoNear} from "../utils/helper";
import {sleep} from "../utils/sleep";
import {getLogger} from "../utils/log";


const logger = getLogger("SleepSkill")


export class SleepSkill {


    public static findBedBlock(searchRadius: number, count: number) {
        return bot.findBlock({
            point: bot.entity.position,
            matching: (block: Block) => block && block.name.includes("bed"),
            maxDistance: searchRadius,
            count: count
        })
    }

    public static async gotoSleep(searchRadius: number, count: number, maxTry=5) {
        logger.info(`Sleep skill executing...`)
        try {
            const bedBlock = this.findBedBlock(searchRadius, count);
            if (bedBlock == null) {
                logger.warn("Sleep skill stopped: Can not find any bed block nearby.")
                return
            }
            await tryGotoNear(bedBlock.position)

            logger.info(`Found the bed, ready to sleep.`)
            let tryCount = 0
            while (!bot.isSleeping && tryCount < maxTry) {
                await bot.sleep(bedBlock)
                await sleep(50)
                tryCount += 1
            }
            logger.info(`Awake`)
        } catch (e: any) {
            logger.error(`Can not sleep because: ${e.message}`)
        }
    }
}