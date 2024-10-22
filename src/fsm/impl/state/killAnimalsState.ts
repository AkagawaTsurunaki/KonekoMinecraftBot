import {AbstractState} from "../../abstractState";
import {range} from "../../../common/decorator/range";
import {lock} from "../../../common/decorator/lock";
import {getLogger} from "../../../util/logger";
import {stateDoc} from "../../../common/decorator/stateDoc";
import {ExtendedBot} from "../../../extension/extendedBot";
import {AutoClearZeroValueMap} from "../../../util/mapUtil";
import {clamp, dot, sum} from "../../../util/math";
import {enableKillAnimalsState, setEnableKillAnimalsState} from "./searchResourceState";

const logger = getLogger("KillAnimalsState")

export const targetAnimals = new AutoClearZeroValueMap<string, number>()

@stateDoc({
    name: "KillAnimalsState",
    description: "Attack and kill the nearest animal that can drop meat."
})
export class KillAnimalsState extends AbstractState {
    private searchAnimalRadius: number = 16

    constructor(bot: ExtendedBot) {
        super("KillAnimalsState", bot);
    }

    @range(0, 1)
    getTransitionValue(): number {
        if (!enableKillAnimalsState) return 0
        if (targetAnimals.size > 0) {
            const targetCount = sum(targetAnimals.toValueList())
            const entities = this.findAnimals(targetCount);
            const distSum = sum(entities.map(entity => this.bot.utils.distanceTo(entity)));
            const dist = 1 - clamp((distSum / (targetCount * this.searchAnimalRadius)), 0, 1)
            const food = clamp((20 - this.bot.food) / 20, 0, 1)
            logger.debug(`Dist factor is ${dist}`)
            return dot([0.8, 0.2], [dist, food])
        }
        return 0
    }

    onListen() {
        super.onListen();
        this.bot.on("entityDead", entity => {
            if (!entity) return
            if (!entity.name) return;
            if (targetAnimals.has(entity.name)) {
                targetAnimals.setAndAdd(entity.name, -1)
            }
        })
    }

    private findAnimals(count: number) {
        const entities = this.bot.utils.findEntities({
            matching: entity => entity.name !== undefined && targetAnimals.toKeyList().includes(entity.name),
            maxDistance: this.searchAnimalRadius,
            count: count
        });

        logger.debug(`Find ${entities.length} animals.`)

        return entities
    }

    @lock()
    async onUpdate() {
        super.onUpdate();

        const entities = this.findAnimals(100);

        if (entities.length === 0) {
            targetAnimals.clear()
        }

        for (let animalEntity of entities) {
            logger.info(`Attack animal ${animalEntity.name}`)
            await this.bot.skills.attack.equipWeapon()
            await this.bot.pvp.attack(animalEntity)
        }
        setEnableKillAnimalsState(false)
    }

    onExit() {
        super.onExit();
        targetAnimals.clear()
    }
}