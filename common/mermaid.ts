import {AutoFiniteStateMachine} from "../newFsm/fsm";
import pino from "pino";
import pretty from 'pino-pretty';
const stream = pretty({
    colorize: true
})

const logger = pino({name: "MermaidGenerator"}, stream)

export class MermaidGenerator {
    public generate(fsm: AutoFiniteStateMachine) {
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