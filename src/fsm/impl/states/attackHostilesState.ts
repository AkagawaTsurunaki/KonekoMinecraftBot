import {AbstractState} from "../../abstractState";
import {createLevelFuncByMap} from "../../../utils/math";
import {AttackSkill} from "../../../skills/attackSkill";
import {bot} from "../../../../index";
import {range} from "../../../common/decorator";
import {stateDoc} from "../../../decorator/stateDoc";

@stateDoc({
    name: "AttackHostilesState",
    description: "Attack hostiles approaching robots.",
    issue: "Probably not dodge from hostiles, but rather lunge aggressively"
})
export class AttackHostilesState extends AbstractState {
    constructor() {
        super("AttackHostilesState");
    }

    /**
     * 索敌半径
     * @private
     */
    private searchRadius = 20

    /**
     * 二级警戒半径
     * @private
     */
    private attentionRadius = 16

    /**
     * 一级警戒半径
     * @private
     */
    private warningRadius = 12

    /**
     * 进攻半径
     * @private
     */
    private attackRadius = 9

    private radiusLevelFunc = createLevelFuncByMap(new Map([
        [-Infinity, 1],
        [0, 1],
        [this.attackRadius, 0.8],
        [this.warningRadius, 0.5],
        [this.attentionRadius, 0.3],
        [this.searchRadius, 0.1],
        [Infinity, 0]
    ]))

    @range(0, 1)
    getTransitionValue(): number {
        const hostile = AttackSkill.findNearestHostile(this.searchRadius)
        if (!hostile) return 0.0
        const dist = bot.entity.position.distanceTo(hostile.position)
        return this.radiusLevelFunc(dist)
    }

    async onEnter() {
        super.onEnter();
        // 切换武器
        await AttackSkill.equipWeapon()
    }

    async onUpdate() {
        super.onUpdate()
        // 攻击怪物
        await AttackSkill.attackNearestHostiles(this.attackRadius)
    }

    async onExit() {
        super.onExit();
        await bot.pvp.stop()
    }
}