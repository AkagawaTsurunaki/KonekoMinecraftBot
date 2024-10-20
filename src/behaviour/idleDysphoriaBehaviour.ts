import {LimitedArray} from "../util/limitArray";
import {Vec3} from "vec3";
import {Timer} from "../util/timer";
import {AbstractBehaviour} from "./abstractBehaviour";
import {ExtendedBot} from "../extension/extendedBot";
import {behaviourDoc} from "../common/decorator/behaviourDoc";


@behaviourDoc({
    name: "IdleDysphoriaBehaviour",
    description: "When bot keep in IdleState or stuck, try to go to the other place."
})
export class IdleDysphoriaBehaviour extends AbstractBehaviour {
    private readonly maxTimeSampleNum = 3
    private readonly epsilon = 2
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

    constructor(bot: ExtendedBot) {
        super(bot)
        this.bot.on("physicsTick", () => {
            this.timer.onPhysicsTick()
            if (this.timer.check()) {
                this.posSamples.add(bot.entity.position)
            }
        })
    }
}