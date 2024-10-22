import {AbstractState} from "../../abstractState";
import {range} from "../../../common/decorator/range";
import {getLogger} from "../../../util/logger";
import {AutoClearZeroValueMap} from "../../../util/mapUtil";

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

export class SearchResourceState extends AbstractState {

    @range(0, 1)
    getTransitionValue(): number {
        if (targetItemNameMap.size > 0) {
            // Search for chests?
            enableSearchForChestState = true
            // Kill animals?
            enableSearchForChestState = true
            // So on...
            return 0.4
        }
        return 0
    }

    onListen() {
        super.onListen();
        this.bot.events.on("masterPlainChat", (username, message) => {
            if (message === "find") {
                targetItemNameMap.set("porkchop", 1)
                logger.debug("porkchop")
            }
        })
    }

}


