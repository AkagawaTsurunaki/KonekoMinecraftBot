import {AbstractState} from "./fsm";
import {FollowSkill} from "../skills/followSkill";
import {bot} from "../index";
import {clamp} from "../utils/math";


export class FollowPlayerState extends AbstractState {

    /**
     * 搜索玩家半径，只有在此半径的玩家才会被搜索。
     * @private
     */
    private searchRadius = 128;
    /**
     * 接触玩家的半径，小于此半径机器人将不会再执行跟随技能。
     * @private
     */
    private contactRadius = 10;


    constructor() {
        super("跟随玩家状态");
    }

    getCondVal(): number {
        const player = FollowSkill.findNearestPlayer(0, this.searchRadius);
        // 如果没有玩家再身边，状态转移
        if (player == null) return 0
        const dist = bot.entity.position.distanceTo(player.position)
        // 小于 contactRadius 则不再执行跟踪，状态转移
        if (dist <= this.contactRadius) return 0
        return clamp(dist / this.searchRadius, 0, 1)
    }

    async onEntered() {
        if (this.isEntered) return
        this.isEntered = true
        await FollowSkill.followNearestPlayer(this.contactRadius, true)
        this.isEntered = false
    }

    onExited() {
        this.isEntered = false
    }

    onUpdate(...args: any[]) {
    }

}