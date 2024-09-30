import {State} from "../fsm/fsm";
import {Follow} from "../skills/follow";
import {log} from "../utils/log";
import {bot} from "../index";
import {clamp, dot} from "../utils/math";
import {FearBehaviour} from "../behaviours/fear";

export class FollowState extends State {

    public name = "跟随状态"
    private minDistance = 10
    //                    [难度，饥饿值，饱和度，生命值，月相，时间]
    private fearWeights = [0.3, 0.5, 0.3, 0.9, 0.1, 0.8]

    cond(): boolean {
        const player = Follow.findNearestPlayer(0, 64)
        if (player) {
            const dist = player.position.distanceTo(bot.entity.position)
            return dist > this.minDistance
        }
        return true
    }

    takeAction() {
        const vec = FearBehaviour.getFearVector()
        console.log(vec)
        const fearVal = dot(this.fearWeights, FearBehaviour.getFearVector())

        if (Number.isNaN(fearVal)) return
        this.minDistance = clamp(Math.exp(-fearVal) * 30 - 5, 2, 64)

        log(`当前追踪距离：${this.minDistance}`, true)
        Follow.followNearestPlayer(this.minDistance, true).then(
            () => log(`跟随最近玩家完成`)
        )
    }

    updateEnv(env: any) {

    }

}