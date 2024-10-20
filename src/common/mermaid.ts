import {getLogger} from "../util/logger";
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

    public static generateInstructionForm(m: Map<string, string>) {
        let result = "| Instruction | Description |\n" +
            "|----------|----|\n"
        m.forEach((value, key) => {
            result += "| " + key + "|" + value + "|" + "\n"
        })
        logger.info("Instruction form generated")
        logger.info(result)
        return result
    }
}