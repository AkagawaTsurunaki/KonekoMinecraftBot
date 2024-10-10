import {BaseState} from "../fsm";
import {createLevelFuncByMap} from "../../utils/math";
import {AttackSkill} from "../../skills/attackSkill";
import {bot} from "../../index";
import {lock} from "../../common/decorator";

export class AttackHostilesState extends BaseState {
    parameters = {
        searchRadius: 20, // 索敌半径
        attentionRadius: 16, // 二级警戒半径
        warningRadius: 12, // 一级警戒半径,
        attackRadius: 9, // 进攻半径
    }

    functions = {
        radiusLevelFunc: createLevelFuncByMap(new Map([
            [-Infinity, 1],
            [0, 1],
            [this.parameters.attackRadius, 0.8],
            [this.parameters.warningRadius, 0.5],
            [this.parameters.attentionRadius, 0.3],
            [this.parameters.searchRadius, 0.1],
            [Infinity, 0]
        ]))
    }

    constructor() {
        super("攻击怪物状态");
    }

    async onUpdate() {
        const hostile = AttackSkill.findNearestHostile(this.parameters.searchRadius)
        if (!hostile) return 0.0
        const dist = bot.entity.position.distanceTo(hostile.position)
        this.transitionValue = this.functions.radiusLevelFunc(dist)
    }

    // TODO: 设计一个锁阻止在每一个刻内被多次调用
    @lock()
    async onEnter() {
        // 切换武器
        await AttackSkill.equipWeapon()
        // 攻击怪物
        await AttackSkill.attackNearestHostiles(this.parameters.attackRadius)
    }

    async onExit() {
        await bot.pvp.stop()
    }

    registerEventListeners(): void {
        this.addEventListener("entityDead", entity => {
            if (entity.type === "hostile") {
                bot.chat(`我击杀了 ${entity.displayName}`)
            }
        })
    }
}