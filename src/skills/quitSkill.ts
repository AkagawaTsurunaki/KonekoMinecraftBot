import {getLogger} from "../utils/logger";
import {AbstractSkill} from "./abstractSkill";

const logger = getLogger("QuitSkill")

export class QuitSkill extends AbstractSkill {

    private readonly responses: string[] = [
        "那我走喵~", "拜拜喵~", "下班儿了喵~", "Bye!"
    ]

    public quitGame() {
        const index = Math.floor(Math.random() * this.responses.length);
        this.bot.chat(this.responses[index])
        this.bot.quit(`${this.bot.option.masterName} asked you to quit.`)
        logger.info("Bot exited the game.")
    }
}