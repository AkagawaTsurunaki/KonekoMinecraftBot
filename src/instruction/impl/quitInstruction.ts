import {Instruction} from "../instruction";
import {QuitSkill} from "../../skills/quitSkill";
import {instructionDoc} from "../../decorator/instructionDoc";


@instructionDoc({name: "Quit Game", description: "Ask bot to quit from the game."})
export class QuitInstruction extends Instruction {
    constructor() {
        super({
            command: "quit", func: () => QuitSkill.quitGame()
        })
    }
}