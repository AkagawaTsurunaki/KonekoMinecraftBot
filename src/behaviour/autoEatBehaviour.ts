import {AbstractBehaviour} from "./abstractBehaviour";
import {ExtendedBot} from "../extension/extendedBot";
import {behaviourDoc} from "../common/decorator/behaviourDoc";

@behaviourDoc({name: "AutoEatBehaviour", description: "Thanks to `mineflayer-auto-eat`, auto eat supported."})
export class AutoEatBehaviour extends AbstractBehaviour {

    constructor(bot: ExtendedBot) {
        super(bot)
        this.bot.autoEat.enableAuto()
    }
}