import {State} from "./fsm";
import {Attack} from "../skills/attack";
import {bot} from "../index";

export class AttackHostileState extends State {

    cond() {
        const hostile = Attack.findNearestHostile(16)
        if (!hostile) return false
        const dist = bot.entity.position.distanceTo(hostile.position)
        return dist < 9
    }

    async takeAction() {
        // console.log(bot.inventory.items());
        // bot.equip()
        // 切换武器
        const weapons = bot.inventory.items().filter(item => item.name.includes("sword") || item.name.includes("axe"))
        // console.log(swords);
        if (weapons && weapons.length > 0) {
            await bot.equip(weapons[0], "hand")
        }
        await Attack.attackNearestHostiles(9)
    }

    updateEnv(env: any) {
    }

}