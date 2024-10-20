import {LimitedArray} from "../util/limitArray";
import {ExtendedBot} from "../extension/extendedBot";

export class ChatHistory {
    public readonly maxHistory = 20
    private readonly history: LimitedArray<string>

    constructor(bot: ExtendedBot) {
        this.history = new LimitedArray(this.maxHistory)

        bot.on("chat", (username: string, message: string) => {
            if (username !== bot.username) {
                this.history.add(message)
            }
        })
    }

    checkLatestInclude(keywords: string[]) {
        const length = this.history.length
        for (let i = length - 1; i >= 0; i--) {
            for (let keyword of keywords) {
                if (this.history.getArray()[i].includes(keyword)) {
                    return i
                }
            }
        }
        return -1
    }
}

