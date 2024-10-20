import {AbstractState} from "../../abstractState";
import {lock} from "../../../common/decorator/lock";
import {Vec3} from "vec3";
import {clampVector, dot} from "../../../util/math";
import {range} from "../../../common/decorator/range";
import {ExtendedBot} from "../../../extension/extendedBot";
import {stateDoc} from "../../../common/decorator/stateDoc";

@stateDoc({
    name: "FishingState",
    description: "If bot has a fishing rod in the inventory and thinks it is close to a certain size of water, " +
        "it will throw the rod tat where it is facing.",
    issue: "Bot may throw the fishing rod onto the surface of ground instead of the water."
})
export class FishingState extends AbstractState {
    constructor(bot: ExtendedBot) {
        super("FishingState", bot);
    }

    private readonly directions = [
        new Vec3(0, 0, 1),
        new Vec3(0, 0, -1),
        new Vec3(0, 1, 0),
        new Vec3(0, -1, 0),
        new Vec3(1, 0, 0),
        new Vec3(-1, 0, 0),
    ]

    private readonly warningRadius = 10
    private readonly aroundWaterRadius = 6

    @range(0, 1)
    getTransitionValue(): number {
        const item = this.bot.utils.itemByName("fishing_rod");
        if (!item) return 0;
        const lookAt = this.bot.blockAtEntityCursor();
        if (!lookAt) return 0;

        const isRaining = this.bot.isRaining;
        const nearestHostile = this.bot.skills.attack.findNearestHostile(this.warningRadius);
        let waterNearCursor = 0

        this.directions.forEach(pos => {
            if (this.bot.blockAt(lookAt.position.add(pos))?.name === "water") {
                waterNearCursor += 1
            }
        })

        const waterAround = this.bot.findBlocks({
            matching: block => block.name === "water",
            maxDistance: this.aroundWaterRadius
        }).length

        const x = clampVector([
            isRaining ? 1 : 0,
            nearestHostile ? nearestHostile.position.distanceTo(this.bot.spawnPoint) / this.warningRadius : 1,
            waterNearCursor / this.directions.length,
            waterAround / this.aroundWaterRadius,
            this.bot.shares.chatHistory.checkLatestInclude(["fishing", "fish", "鱼", "钓鱼", "钓"]) === -1 ? 0 : 1
        ], 0, 1)

        const w = [0.05, 0.1, 0.1, 0.25, 0.5]

        return dot(w, x)
    }

    @lock()
    async onUpdate() {
        super.onUpdate();
        await this.bot.skills.fishing.startFishing()
    }

    onExit() {
        super.onExit();
        this.bot.skills.fishing.stopFishing()
    }
}
