import {getLogger} from "../utils/logger";
import {FiniteStateMachine} from "../newFsm/fsm";


const logger = getLogger("MermaidGenerator")

export class MermaidGenerator {
    public static generate(fsm: FiniteStateMachine) {
        let lines = fsm.allStates.flatMap(state =>
            state.nextStates.map(nextState => `${state.id} --> ${nextState.id}`)
        );
        lines = Array.from(new Set(lines));
        logger.info(`Mermaid state diagram generated.`)
        let result = ""
        lines.forEach(line => result += line + "\n")
        logger.info(result)
        return result
    }
}