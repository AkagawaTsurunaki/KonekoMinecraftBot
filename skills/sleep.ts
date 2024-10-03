import {bot} from "../index";
import {Block} from "prismarine-block";
import {gotoNear} from "../utils/helper";

export class Sleep {


    public static findBedBlock(searchRadius = 64) {
        return bot.findBlock({
            point: bot.entity.position,
            matching: (block: Block) => block && block.name.includes("bed"),
            maxDistance: searchRadius,
            count: 5
        })
    }

    public static async gotoSleep() {
        const bedBlock = this.findBedBlock();
        if (bedBlock == null) {
            console.warn(`附近没有找到床……`)
            return
        }
        await gotoNear(bedBlock.position)
        console.log(`已找到床，准备睡觉`)
        await bot.sleep(bedBlock)
        console.log(`已起床`)
    }
}