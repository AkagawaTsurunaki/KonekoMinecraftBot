import {bot} from "../../index";
import {Entity} from "prismarine-entity";
import {Vec3} from "vec3";
import {goals, Movements} from "mineflayer-pathfinder";
import {masterName} from "../common/const";
import {getLogger} from "../utils/logger";


const logger = getLogger("SleepSkill")


export class FollowSkill {

    /**
     * 根据用户名跟随指定玩家。
     * @param username 用户名。
     * @param minFollowingDistance 最小跟随距离。
     */
    public static async followByUsername(username: string, minFollowingDistance: number) {

        if (!bot.players[username]) {
            logger.error(`Can not find the player "${username}".`)
        }

        const playerFilter = (e: Entity) => e.type === 'player'
            && e.username == username
            && e.position.distanceTo(bot.entity.position) > minFollowingDistance
        const player = bot.nearestEntity(playerFilter)
        if (player) {
            const movements = new Movements(bot)
            // 即便设置了 canOpenDoors 为 true，但是机器人还是可能破坏方块来跟随你
            movements.canOpenDoors = true;
            bot.pathfinder.setMovements(movements);
            const goal = new goals.GoalFollow(player, minFollowingDistance)
            bot.pathfinder.setGoal(goal);
            await bot.lookAt(player.position.offset(0, 1, 0))
        }
    }

    /**
     * 跟随最近的玩家。
     * @param minFollowingDistance 最小跟随距离。
     * @param masterFirst 是否优先跟随主人。
     */
    public static async followNearestPlayer(minFollowingDistance: number, masterFirst: boolean) {
        const masterPlayer = bot.players[masterName];
        if (masterPlayer != null && masterFirst) {
            await this.followByUsername(masterPlayer.username, minFollowingDistance)
        } else {
            const nearestPlayer = bot.nearestEntity(e => e.type === 'player')
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
    public static async faceToSoundSource(position: Vec3, soundCategory: string | number) {
        const distance = bot.entity.position.distanceTo(position)
        if (soundCategory === 'player') {
            if (1 < distance && distance < 20) {
                await bot.lookAt(position)
            }
        } else if (soundCategory === 'hostile') {
            if (distance < 20) {
                await bot.lookAt(position)
            }
        }
    }

    /**
     * 寻找最小半径和最大半径范围内的玩家。
     * @param minRadius 最小搜索半径。
     * @param maxRadius 最大搜索半径。
     */
    public static findNearestPlayer(minRadius: number, maxRadius: number): Entity | null {
        const playerFilter = (e: Entity) => e.type === 'player'
        const player = bot.nearestEntity(playerFilter)
        if (player) {
            const dist = player.position.distanceTo(bot.entity.position)
            if (minRadius < dist && dist < maxRadius) {
                return player
            }
        }
        return null
    }
}