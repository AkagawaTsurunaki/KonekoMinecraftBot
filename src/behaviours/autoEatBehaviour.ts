import {AbstractBehaviour} from "./abstractBehaviour";
import {ExtendedBot} from "../extension/extendedBot";

export class AutoEatBehaviour extends  AbstractBehaviour{

    constructor(bot: ExtendedBot) {
        super(bot)
        this.bot.autoEat.enableAuto()
    }
}