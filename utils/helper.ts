import {bot} from "../index";
import {Entity} from "prismarine-entity";
import {Vec3} from "vec3";
import {goals, Movements} from "mineflayer-pathfinder";

export function findPlayerByUsername(username: string): Entity {
    if (bot && username) {
        for (const id in bot.entities) {
            const e = bot.entities[id]
            if (e.username && e.username === username) {
                return e
            }
        }
    }

    return null
}

const entityTypes = ['player', 'mob', 'object', 'global', 'orb', 'projectile', 'hostile', 'other']

export function getEntitiesTypeStatistic(): Map<string, number> {
    const result = new Map<string, number>()
    for (let id in bot.entities) {
        const entity = bot.entities[id];
        if (!entity) continue
        if (result.has(entity.type)) {
            result[entity.type] += 1
        } else {
            result[entity.type] = 1
        }
    }
    return result
}

export function goto(block: Vec3) {
    const movements = new Movements(bot)
    movements.canDig = false
    movements.allow1by1towers = false
    movements.canOpenDoors = true
    const goal = new goals.GoalBlock(block.x, block.y, block.z)
    bot.pathfinder.setMovements(movements);
    bot.pathfinder.setGoal(goal)
}