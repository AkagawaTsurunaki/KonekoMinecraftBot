import {sum} from "../utils/math";
import {getLogger} from "../utils/logger";
import {AbstractAlgorithm} from "./abstractAlgorithm";
import {ExtendedBot} from "../extension/extendedBot";

const logger = getLogger("LightInSightAlgorithm")

export class LightInSightAlgorithm extends AbstractAlgorithm {

    constructor(bot: ExtendedBot) {
        super(bot);
    }


    /**
     * 计算球体范围内的平均光照。
     * 注意 mineflayer 中的光照更新尚未实现，因此当更新世界后获取到的光照/天空光照是错误的，重新登入服务器将会获取到更新后的光照。
     * @param radius
     */
    public ballRangeAvgLight(radius: number) {
        logger.warn(`Note that the light update is not implemented by mineflayer, 
        so you will get wrong light/skylight of block when you update the world.
        Re-login the server will get the updated light info.
        `.trim())
        const safeBlocks = this.bot.findBlocks({
            point: this.bot.entity.position,
            count: Math.pow(radius, 3),
            maxDistance: radius,
            matching: block => block.name.includes("air")
        });

        const lights = safeBlocks.map(pos =>
            this.bot.world.getBlockLight(pos));
        return sum(lights) / lights.length
    }
}