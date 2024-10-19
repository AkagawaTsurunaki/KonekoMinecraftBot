import {ExtendedBot} from "../extension/extendedBot";

export class AbstractCognition {
    protected bot: ExtendedBot

    constructor(bot: ExtendedBot) {
        this.bot = bot
    }

}