import {ExtendedBot} from "../extension/extendedBot";

export class AbstractAlgorithm {
    protected bot: ExtendedBot

    constructor(bot: ExtendedBot) {
        this.bot = bot
    }
}