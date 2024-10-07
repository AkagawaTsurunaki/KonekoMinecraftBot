import {bot} from "../index";
import {Entity} from "prismarine-entity";
import {Vec3} from "vec3";
import {goals, Movements} from "mineflayer-pathfinder";
import {randomNeg1ToPos1} from "./math";
import {masterName} from "../const";

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

export async function tryGotoNear(block: Vec3, timeout: boolean = false) {
    const goal = new goals.GoalNear(block.x, block.y, block.z, 1)
    try {
        await bot.pathfinder.goto(goal)
    } catch (e) {
        if (timeout && e.message.includes("Timeout")) {
            const goal = new goals.GoalNear(block.x + randomNeg1ToPos1(), block.y + randomNeg1ToPos1(), block.z + randomNeg1ToPos1(), 1)
            await bot.pathfinder.goto(goal)
        }
    }
}

export function isOtherPlayer(entity: Entity) {
    if (!entity) return false
    return entity.type === "player" && entity.username != bot.username;
}

export function isMaster(entity: Entity) {
    if (isOtherPlayer(entity)) {
        if (entity.username === masterName) {
            return true
        }
    }
    return false
}