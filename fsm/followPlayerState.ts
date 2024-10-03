import {AbstractState} from "./fsm";
import {FollowSkill} from "../skills/followSkill";
import {log} from "../utils/log";
import {bot} from "../index";
import {clamp, createLevelFuncByMap, dot} from "../utils/math";
import {FearBehaviour} from "../behaviours/fear";


export class FollowPlayerState extends AbstractState {

    private searchRadius = 64
    private minDistance = 10
    //                    [难度，饥饿值，饱和度，生命值，月相，时间]
    private fearWeights = [0.3, 0.5, 0.3, 0.9, 0.1, 0.8]
    private distLevelMap = createLevelFuncByMap(new Map([
        [-Infinity, 0], [5, 0.1], [10, 0.3], [16, 0.5], [24, 0.6], [32, 0.8], [Infinity, 1]
    ]))

    constructor() {
        super("跟随玩家状态");
    }

    getCondVal(): number {
        const fearVal = dot(this.fearWeights, FearBehaviour.getFearVector())
        let dist = Infinity

        const player = FollowSkill.findNearestPlayer(0, this.searchRadius)
        if (player) {
            dist = player.position.distanceTo(bot.entity.position)
        }
        return clamp(this.distLevelMap(clamp(dist, 0, 1000)) * 0.7 + fearVal * 0.3, 0, 1)
    }

    async onEntered() {
        const fearVal = dot(this.fearWeights, FearBehaviour.getFearVector())

        if (Number.isNaN(fearVal)) return
        this.minDistance = clamp(Math.exp(-fearVal) * 30 - 5, 2, 64)

        log(`当前追踪距离：${this.minDistance}`)
        await FollowSkill.followNearestPlayer(this.minDistance, true)
    }

    onExited() {
    }

    onUpdate(...args: any[]) {
    }

}