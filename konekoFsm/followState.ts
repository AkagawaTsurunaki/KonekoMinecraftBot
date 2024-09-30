import {State} from "../fsm/fsm";
import {Follow} from "../skills/follow";
import {log} from "../utils/log";
import {bot} from "../index";

export class FollowState extends State {

    public name = "跟随状态"
    private minDistance = 10

    cond(): boolean {
        const player = Follow.findNearestPlayer(0, 64)
        if (player) {
            const dist = player.position.distanceTo(bot.entity.position)
            return dist > this.minDistance
        }
        return true
    }

    takeAction() {
        Follow.followNearestPlayer(this.minDistance, true).then(
            () => log(`跟随最近玩家完成`)
        )
    }

    updateEnv(env: any) {

    }

}