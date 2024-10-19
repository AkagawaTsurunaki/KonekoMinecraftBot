import {Entity} from "prismarine-entity";
import {Vec3} from "vec3";
import {goals, Movements} from "mineflayer-pathfinder";
import {getLogger} from "../util/logger";
import {AbstractSkill} from "./abstractSkill";

const logger = getLogger("SleepSkill")

export class FollowSkill extends AbstractSkill {

    /**
     * 根据用户名跟随指定玩家。
     * @param username 用户名。
     * @param minFollowingDistance 最小跟随距离。
     */
    public async followByUsername(username: string, minFollowingDistance: number) {

        if (!this.bot.players[username]) {
            logger.error(`Can not find the player "${username}".`)
        }

        const playerFilter = (e: Entity) => e.type === 'player'
            && e.username == username
            && e.position.distanceTo(this.bot.entity.position) > minFollowingDistance
        const player = this.bot.nearestEntity(playerFilter)
        if (player) {
            const movements = new Movements(this.bot)
            // 即便设置了 canOpenDoors 为 true，但是机器人还是可能破坏方块来跟随你
            movements.canOpenDoors = true;
            this.bot.pathfinder.setMovements(movements);
            const goal = new goals.GoalFollow(player, minFollowingDistance)
            this.bot.pathfinder.setGoal(goal);
            await this.bot.lookAt(player.position.offset(0, 1, 0))
        }
    }

    /**
     * 跟随最近的玩家。
     * @param minFollowingDistance 最小跟随距离。
     * @param masterFirst 是否优先跟随主人。
     */
    public async followNearestPlayer(minFollowingDistance: number, masterFirst: boolean) {
        const masterPlayer = this.bot.players[this.bot.option.masterName];
        if (masterPlayer != null && masterFirst) {
            await this.followByUsername(masterPlayer.username, minFollowingDistance)
        } else {
            const nearestPlayer = this.bot.nearestEntity(e => e.type === 'player')
            if (nearestPlayer && nearestPlayer.username) {
                await this.followByUsername(nearestPlayer.username, minFollowingDistance)
            }
        }
    }

    /**
     * 面向声源。
     * @param position 声源位置。
     * @param soundCategory 声音类别。
     */
    public async faceToSoundSource(position: Vec3, soundCategory: string | number) {
        const distance = this.bot.entity.position.distanceTo(position)
        if (soundCategory === 'player') {
            if (1 < distance && distance < 20) {
                await this.bot.lookAt(position)
            }
        } else if (soundCategory === 'hostile') {
            if (distance < 20) {
                await this.bot.lookAt(position)
            }
        }
    }

    /**
     * 寻找最小半径和最大半径范围内的玩家。
     * @param minRadius 最小搜索半径。
     * @param maxRadius 最大搜索半径。
     */
    public findNearestPlayer(minRadius: number, maxRadius: number): Entity | null {
        const playerFilter = (e: Entity) => e.type === 'player'
        const player = this.bot.nearestEntity(playerFilter)
        if (player) {
            const dist = player.position.distanceTo(this.bot.entity.position)
            if (minRadius < dist && dist < maxRadius) {
                return player
            }
        }
        return null
    }
}