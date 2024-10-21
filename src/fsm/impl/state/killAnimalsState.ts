import {AbstractState} from "../../abstractState";
import {range} from "../../../common/decorator/range";
import {lock} from "../../../common/decorator/lock";
import {getLogger} from "../../../util/logger";
import {stateDoc} from "../../../common/decorator/stateDoc";
import {ExtendedBot} from "../../../extension/extendedBot";
import {AutoClearZeroValueMap} from "../../../util/mapUtil";

const logger = getLogger("KillAnimalsState")

const meatDroppableAnimals = ['cow', 'chicken', 'pig', 'sheep', 'rabbit']
const rawMeat = new Map([['cow', "beef"], ['chicken', "chicken"], ['pig', "porkchop"], ['sheep', "mutton"], ['rabbit', "rabbit"]])
const targetAnimals = new AutoClearZeroValueMap<string, number>()

@stateDoc({
    name: "KillAnimalsState",
    description: "Attack and kill the nearest animal that can drop meat."
})
export class KillAnimalsState extends AbstractState {
    private targetAnimalEntityIdList: Set<number> = new Set<number>()

    constructor(bot: ExtendedBot) {
        super("KillAnimalsState", bot);
    }

    @range(0, 1)
    getTransitionValue(): number {
        if (targetAnimals.size > 0) {
            return 1
        }
        return 0
    }

    onListen() {
        super.onListen();
        this.bot.events.on("masterPlainChat", (username, message) => {
            if (message === "kill animals") {
                targetAnimals.set("pig", 1)
            }
        })
        this.bot.on("entityDead", entity => {
            if (!entity) return
            if (!entity.name) return;
            if (targetAnimals.has(entity.name)) {
                targetAnimals.setAndAdd(entity.name, -1)
            }
            if (this.targetAnimalEntityIdList.has(entity.id)) {
                this.targetAnimalEntityIdList.delete(entity.id)
            }
        })
    }

    @lock()
    async onUpdate() {
        super.onUpdate();

        for (let entityId of this.targetAnimalEntityIdList) {
            if (!this.bot.entities[entityId]) {
                this.targetAnimalEntityIdList.delete(entityId)
            }
        }

        const targetAnimalEntities = []
        for (let [animalName, amount] of targetAnimals) {
            for (let entityId in this.bot.entities) {
                const entity = this.bot.entities[entityId];
                if (entity.name === animalName) {
                    if (entity.position.distanceTo(this.bot.entity.position) < 16) {
                        this.targetAnimalEntityIdList.add(entity.id)
                        targetAnimalEntities.push(entity)
                    }
                }
            }
        }
        for (let animalEntity of targetAnimalEntities) {
            logger.info(`Attack animal ${animalEntity.name}`)
            await this.bot.skills.attack.equipWeapon()
            await this.bot.pvp.attack(animalEntity)
        }
    }
}