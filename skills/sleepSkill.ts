import {bot} from "../index";
import {Block} from "prismarine-block";
import {tryGotoNear} from "../utils/helper";

export class SleepSkill {


    public static findBedBlock(searchRadius: number, count: number) {
        return bot.findBlock({
            point: bot.entity.position,
            matching: (block: Block) => block && block.name.includes("bed"),
            maxDistance: searchRadius,
            count: count
        })
    }

    public static async gotoSleep(searchRadius: number, count: number) {
        try {
            const bedBlock = this.findBedBlock(searchRadius, count);
            if (bedBlock == null) {
                console.warn(`附近没有找到床……`)
                return
            }
            await tryGotoNear(bedBlock.position)
            console.log(`已找到床，准备睡觉`)
            await bot.sleep(bedBlock)
            console.log(`已起床`)
        } catch (e) {
            console.error(`无法睡觉，原因是 ${e.message}`)
        }
    }
}