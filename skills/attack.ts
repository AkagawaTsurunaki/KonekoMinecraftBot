import "mineflayer-pvp/lib/index";
import {Entity} from "prismarine-entity";
import {bot} from "../index";


export class Attack {

    public static findNearestHostile(attackRadius: number) {
        const mobFilter = (e: Entity) =>
            (e.type === 'hostile' || e.displayName == 'Phantom')
            && e.position.distanceTo(bot.entity.position) < attackRadius
        return bot.nearestEntity(mobFilter)
    }

    public static async attackNearestHostiles(attackRadius: number) {
        const hostile = this.findNearestHostile(attackRadius)
        if (hostile) {
            await bot.pvp.attack(hostile)
        }
    }

    public static async equipWeapon() {
        const weapons = bot.inventory.items().filter(item => item.name.includes("sword") || item.name.includes("axe"))
        if (weapons && weapons.length > 0) {
            await bot.equip(weapons[0], "hand")
        }
    }
}