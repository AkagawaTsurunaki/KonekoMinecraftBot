import {AbstractState} from "./fsm";
import {Attack} from "../skills/attack";
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
        const hostile = Attack.findNearestHostile(this.searchRadius)
        if (!hostile) return 0.0
        const dist = bot.entity.position.distanceTo(hostile.position)
        return this.radiusToCondValFunc(dist)
    }

    async onEntered() {
        // 切换武器
        await Attack.equipWeapon()
        // 攻击怪物
        await Attack.attackNearestHostiles(this.attackRadius)
    }

    async onExited() {
        await bot.pvp.stop()
    }

}