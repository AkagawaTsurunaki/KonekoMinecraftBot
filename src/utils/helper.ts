import {bot, botOption} from "../../index";
import {Entity} from "prismarine-entity";
import {Vec3} from "vec3";
import {goals, Movements} from "mineflayer-pathfinder";
import {randomNeg1ToPos1} from "./math";

export function findPlayerByUsername(username: string): Entity | null {
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
    } catch (e: any) {
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
        if (entity.username === botOption.masterName) {
            return true
        }
    }
    return false
}
