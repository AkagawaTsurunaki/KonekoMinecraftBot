import {bot} from "../../index";
import {LimitedArray} from "../utils/limitArray";
import {Vec3} from "vec3";
import {Timer} from "../utils/timer";

export class IdleDysphoria {
    private readonly maxTimeSampleNum = 3
    private readonly epsilon = 1
    private readonly posSamples = new LimitedArray<Vec3>(this.maxTimeSampleNum)
    private timer: Timer = new Timer(120)

    getIdleDysphoriaVal() {
        if (this.epsilon > this.getDisplacementAbsSum()) {
            return Math.random()
        }
        return 0
    }

    getDisplacementAbsSum() {
        const arr = this.posSamples.getArray()
        if (arr.length === 0 || arr.length === 1) return Infinity
        let absSum = 0
        for (let i = 0; i < arr.length - 1; i++) {
            const displacement = arr[i].distanceTo(arr[i + 1]);
            absSum += Math.abs(displacement)
        }
        return absSum
    }

    constructor() {
        bot.on("physicsTick", () => {
            this.timer.onPhysicsTick()
            if (this.timer.check()) {
                this.posSamples.add(bot.entity.position)
            }
        })
    }
}