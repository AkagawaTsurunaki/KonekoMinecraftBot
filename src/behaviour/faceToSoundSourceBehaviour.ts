import {Vec3} from "vec3";
import {AbstractBehaviour} from "./abstractBehaviour";
import {ExtendedBot} from "../extension/extendedBot";

export class FaceToSoundSourceBehaviour extends AbstractBehaviour {

    constructor(bot: ExtendedBot) {
        super(bot)
        this.onListen()
    }

    onListen() {
        this.bot.on("hardcodedSoundEffectHeard", async (_soundId: number,
                                                        soundCategory: string | number,
                                                        position: Vec3) => {
            if (soundCategory === "player" || soundCategory === "hostile" || soundCategory === "mob") {
                await this.bot.lookAt(position)
            }
        })
    }
}