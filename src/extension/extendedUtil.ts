import {Entity} from "prismarine-entity";
import {Vec3} from "vec3";
import {goals, Movements} from "mineflayer-pathfinder";
import {randomNeg1ToPos1} from "../util/math";
import {ExtendedBot} from "./extendedBot";

export class ExtendedUtil {

    protected bot: ExtendedBot

    constructor(bot: ExtendedBot) {
        this.bot = bot
    }

    public findPlayerByUsername(username: string): Entity | null {
        if (this.bot && username) {
            for (const id in this.bot.entities) {
                const e = this.bot.entities[id]
                if (e.username && e.username === username) {
                    return e
                }
            }
        }
        return null
    }

    public goto(block: Vec3) {
        const movements = new Movements(this.bot)
        movements.canDig = false
        movements.allow1by1towers = false
        movements.canOpenDoors = true
        const goal = new goals.GoalBlock(block.x, block.y, block.z)
        this.bot.pathfinder.setMovements(movements);
        this.bot.pathfinder.setGoal(goal)
    }

    public async tryGotoNear(block: Vec3, timeout: boolean = false) {
        const goal = new goals.GoalNear(block.x, block.y, block.z, 1)
        try {
            await this.bot.pathfinder.goto(goal)
        } catch (e: any) {
            if (timeout && e.message.includes("Timeout")) {
                const goal = new goals.GoalNear(block.x + randomNeg1ToPos1(), block.y + randomNeg1ToPos1(), block.z + randomNeg1ToPos1(), 1)
                await this.bot.pathfinder.goto(goal)
            }
        }
    }

    public isOtherPlayer(entity: Entity) {
        if (!entity) return false
        return entity.type === "player" && entity.username != this.bot.username;
    }

    public isMaster(entity: Entity) {
        if (this.isOtherPlayer(entity)) {
            if (entity.username === this.bot.option.masterName) {
                return true
            }
        }
        return false
    }

    public itemByName(name: string) {
        const items = this.bot.inventory.items()
        if (this.bot.registry.isNewerOrEqualTo('1.9') && this.bot.inventory.slots[45]) items.push(this.bot.inventory.slots[45])
        return items.filter(item => item.name === name)[0]
    }

    public distanceTo(entity: Entity) {
        if (entity) {
            return this.bot.entity.position.distanceTo(entity.position)
        }
        return Infinity
    }

    public distanceToMaster() {
        const player = this.bot.utils.master();
        if (player) {
            return this.bot.utils.distanceTo(player.entity)
        }
        return Infinity
    }

    public master() {
        return this.bot.players[this.bot.option.masterName]
    }

    public findEntities(info: {
        point?: Vec3
        matching: number | number[] | ((entity: Entity) => boolean)
        maxDistance?: number
        count?: number
    }) {
        const point = info.point ? info.point : this.bot.entity.position
        const matching = info.matching
        const maxDistance = info.maxDistance ? info.maxDistance : 256
        const count = info.count ? info.count : 1

        const result = []
        for (let id in this.bot.entities) {
            if (count === result.length) {
                // Max count arrived
                break
            }

            const entity = this.bot.entities[id];
            if (!entity) {
                // Skip null entity.
                continue;
            }

            const dist = point.distanceTo(entity.position)
            if (dist >= maxDistance) {
                // Skip too far entity.
                continue;
            }

            if (typeof matching === "function") {
                if (matching(entity)) {
                    result.push(entity)
                }
            } else if (typeof matching === "number") {
                if (matching === Number(id)) {
                    result.push(entity)
                }
            } else if (Array.isArray(matching)) {
                if (matching.includes(Number(id))) {
                    result.push(entity)
                }
            } else {
                throw new Error("matching param is invalid.")
            }
        }

        return result
    }
}