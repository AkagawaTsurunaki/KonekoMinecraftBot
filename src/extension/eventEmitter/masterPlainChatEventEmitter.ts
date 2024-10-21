import {ExtendedEventEmitter} from "./extendedEventEmitter";

export class MasterPlainChatEventEmitter extends ExtendedEventEmitter {
    startEventEmitter(): void {
        this.bot.on("chat", (username, message, translate, jsonMsg, matches) => {
            if (username === this.bot.option.masterName) {
                if (message.length > 0 && message[0] !== "/") {
                    this.bot.events.emit("masterPlainChat", username, message, translate, jsonMsg, matches)
                }
            }
        })
    }
}