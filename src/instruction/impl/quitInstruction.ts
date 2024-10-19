import {Instruction} from "../instruction";
import {ExtendedBot} from "../../extension/extendedBot";
import {instructionDoc} from "../../common/decorator/instructionDoc";


@instructionDoc({name: "Quit Game", description: "Ask bot to quit from the game."})
export class QuitInstruction extends Instruction {
    constructor(bot: ExtendedBot) {
        super(bot, {
            command: "quit", func: () => bot.skills.quit.quitGame()
        })
    }
}