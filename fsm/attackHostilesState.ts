import {AbstractState} from "./fsm";
import {AttackSkill} from "../skills/attackSkill";
import {bot} from "../index";
import {createLevelFuncByMap} from "../utils/math";


export class AttackHostilesState extends AbstractState {

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

    private radioToCondValMap = new Map([
        [-Infinity, 1],
        [0, 1],
        [this.attackRadius, 0.8],
        [this.warningRadius, 0.5],
        [this.attentionRadius, 0.3],
        [this.searchRadius, 0.1],
        [Infinity, 0]
    ])

    private radiusToCondValFunc = createLevelFuncByMap(this.radioToCondValMap)

    constructor() {
        super("攻击怪物状态");
    }

    onUpdate() {
        // 什么也不做
    }


    getCondVal(): number {
        const hostile = AttackSkill.findNearestHostile(this.searchRadius)
        if (!hostile) return 0.0
        const dist = bot.entity.position.distanceTo(hostile.position)
        return this.radiusToCondValFunc(dist)
    }

    async onEnter() {
        // 切换武器
        await AttackSkill.equipWeapon()
        // 攻击怪物
        await AttackSkill.attackNearestHostiles(this.attackRadius)
    }

    async onExit() {
        await bot.pvp.stop()
    }

}