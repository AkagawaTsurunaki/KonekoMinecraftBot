import {bot} from "../../index";
import {Entity} from "prismarine-entity";
import {getLogger} from "../utils/logger";

const logger = getLogger("FishingSkill")

export class FishingSkill {

    private async onCollect (player: Entity, entity: Entity) {
        if (entity.kind === 'Drops' && player === bot.entity) {
            bot.removeListener('playerCollect', this.onCollect)
            await this.startFishing()
        }
    }

    private nowFishing = false

    public async startFishing() {
        logger.info('Fishing')
        try {
            await bot.equip(bot.registry.itemsByName.fishing_rod.id, 'hand')
        } catch (err: any) {
            logger.error(err.message)
            return
        }

        this.nowFishing = true
        bot.on('playerCollect', this.onCollect)

        try {
            await bot.fish()
        } catch (err: any) {
            logger.error(err.message)
        }
        this.nowFishing = false
    }

    public stopFishing() {
        bot.removeListener('playerCollect', this.onCollect)

        if (this.nowFishing) {
            bot.activateItem()
        }
    }
}
