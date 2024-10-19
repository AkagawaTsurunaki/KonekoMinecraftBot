import {Instruction} from "../instruction";
import {instructionDoc} from "../../decorator/instructionDoc";
import {ExtendedBot} from "../../extension/extendedBot";


@instructionDoc({name: "Quit Game", description: "Ask bot to quit from the game."})
export class QuitInstruction extends Instruction {
    constructor(bot: ExtendedBot) {
        super(bot, {
            command: "quit", func: () => bot.skills.quit.quitGame()
        })
    }
}