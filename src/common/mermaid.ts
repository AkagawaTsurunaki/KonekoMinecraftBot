import {getLogger} from "../utils/logger";
import {FiniteStateMachine} from "../fsm/fsm";


const logger = getLogger("MermaidGenerator")

export class DocGenerator {
    public static generateStateDiag(fsm: FiniteStateMachine) {
        let lines = fsm.allStates.flatMap(state =>
            state.nextStates.map(nextState => `${state.id} --> ${nextState.id}`)
        );
        lines = Array.from(new Set(lines));
        logger.info(`Mermaid state diagram generated.`)
        let result = ""
        lines.forEach(line => result += line + "\n")
        logger.info("stateDiagram\n" + result)
        return result
    }

    public static generateForm(fsm: FiniteStateMachine) {
        let result = "| State ID | Description | Issues |\n" +
            "|----------|----|-------|\n"
        fsm.allStates.forEach(state => {
            result += state.id + " | " + state.description + " | " + state.issue + "\n"
        })
        logger.info("State form generated")
        logger.info(result)
        return result
    }
}