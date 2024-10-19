import "mineflayer-pvp/lib/index";
import {Entity} from "prismarine-entity";
import {AbstractSkill} from "./abstractSkill";


export class AttackSkill extends AbstractSkill {

    public findNearestHostile(attackRadius: number) {
        const mobFilter = (e: Entity) =>
            (e.type === 'hostile' || e.displayName == 'Phantom')
            && e.position.distanceTo(this.bot.entity.position) < attackRadius
        return this.bot.nearestEntity(mobFilter)
    }

    public async attackNearestHostiles(attackRadius: number) {
        const hostile = this.findNearestHostile(attackRadius)
        if (hostile) {
            await this.bot.pvp.attack(hostile)
        }
    }

    public async equipWeapon() {
        const weapons = this.bot.inventory.items().filter(item => item.name.includes("sword") || item.name.includes("axe"))
        if (weapons && weapons.length > 0) {
            await this.bot.equip(weapons[0], "hand")
        }
    }
}