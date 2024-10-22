import {AbstractState} from "../../abstractState";
import {range} from "../../../common/decorator/range";
import {getLogger} from "../../../util/logger";
import {AutoClearZeroValueMap} from "../../../util/mapUtil";
import {stateDoc} from "../../../common/decorator/stateDoc";
import {ExtendedBot} from "../../../extension/extendedBot";
import {targetAnimals} from "./killAnimalsState";
import {meatToAnimal} from "../../../common/const";
import {expDelay} from "../../../util/func";

const logger = getLogger("SearchResourceState")
export const targetItemNameMap = new AutoClearZeroValueMap<string, number>()
export var enableSearchForChestState: boolean = false

export function setEnableSearchForChestState(b: boolean) {
    enableSearchForChestState = b
}

export var enableKillAnimalsState: boolean = false

export function setEnableKillAnimalsState(b: boolean) {
    enableSearchForChestState = b
}

@stateDoc({
    name: "SearchResourceState",
    description: "..."
})
export class SearchResourceState extends AbstractState {

    constructor(bot: ExtendedBot) {
        super("SearchResourceState", bot);
    }

    private t = -1

    @range(0, 1)
    getTransitionValue(): number {
        if (targetItemNameMap.size > 0) {
            // Search for chests?
            enableSearchForChestState = true
            // Kill animals?
            enableKillAnimalsState = true
            // So on...
            if (this.t < 0) {
                return 0.4
            } else {
                this.t += 1
                return expDelay(this.t, 5, 1, 0)
            }
        }
        return 0
    }

    onEnter() {
        super.onEnter();
        this.t = 0
    }

    onListen() {
        super.onListen();
        this.bot.events.on("masterPlainChat", (username, message) => {
            if (message === "find") {
                targetItemNameMap.set("porkchop", 1)
                const porkchop = meatToAnimal.get('porkchop');
                if (porkchop) {
                    targetAnimals.set(porkchop, 1)
                }

                logger.debug("porkchop")
            }
        })
        this.bot.events.on("secondTick", () => {

        })
    }

    onExit() {
        super.onExit();
        this.t = -1
        targetItemNameMap.clear()
    }

}


