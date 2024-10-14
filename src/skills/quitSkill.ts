import {bot} from "../../index";
import {masterName} from "../common/const";

export class QuitSkill {

    private static readonly responses: string[] = [
        "那我走喵~", "拜拜喵~", "下班儿了喵~"
    ]

    public static quitGame() {
        const index = Math.floor(Math.random() * this.responses.length);
        bot.chat(this.responses[index])
        bot.quit(`${masterName} asked you to quit.`)
    }
}