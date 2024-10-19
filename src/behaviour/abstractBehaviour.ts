import {ExtendedBot} from "../extension/extendedBot";

export class AbstractBehaviour {
    protected bot: ExtendedBot

    constructor(bot: ExtendedBot) {
        this.bot = bot
    }

}