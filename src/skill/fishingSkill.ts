import {Entity} from "prismarine-entity";
import {getLogger} from "../util/logger";
import {AbstractSkill} from "./abstractSkill";

const logger = getLogger("FishingSkill")

export class FishingSkill extends AbstractSkill {

    private async onCollect(player: Entity, entity: Entity) {
        if (entity.kind === 'Drops' && player === this.bot.entity) {
            this.bot.removeListener('playerCollect', this.onCollect)
            await this.startFishing()
        }
    }

    private nowFishing = false

    public async startFishing() {
        logger.info('Fishing')
        try {
            await this.bot.equip(this.bot.registry.itemsByName.fishing_rod.id, 'hand')
        } catch (err: any) {
            logger.error(err.message)
            return
        }

        this.nowFishing = true
        this.bot.on('playerCollect', this.onCollect)

        try {
            await this.bot.fish()
        } catch (err: any) {
            logger.error(err.message)
        }
        this.nowFishing = false
    }

    public stopFishing() {
        this.bot.removeListener('playerCollect', this.onCollect)

        if (this.nowFishing) {
            this.bot.activateItem()
        }
    }
}
