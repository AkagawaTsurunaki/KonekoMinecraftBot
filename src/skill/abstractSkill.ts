import {ExtendedBot} from "../extension/extendedBot";

export class AbstractSkill {
    protected bot: ExtendedBot

    constructor(bot: ExtendedBot) {
        this.bot = bot
    }
}