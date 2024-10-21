import {AbstractState} from "../../abstractState";
import {range} from "../../../common/decorator/range";
import {getLogger} from "../../../util/logger";
import {AutoClearZeroValueMap} from "../../../util/mapUtil";

const logger = getLogger("SearchResourceState")
const youThinkNeedResource = true
export const resourceNeedForAnimalsState = true
export const needAnimal = "cow"

export class SearchResourceState extends AbstractState {

    @range(0, 1)
    getTransitionValue(): number {
        if (youThinkNeedResource) {
            return 1
        }
        return 0
    }

    onUpdate() {
        super.onUpdate();
    }

    private inInventory() {

    }
}


export const targetItemNameMap = new AutoClearZeroValueMap<string, number>()