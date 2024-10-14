import {Vec3} from "vec3";
import {bot} from "../../index";

export class FaceToSoundSource {

    constructor() {
        this.onListen()
    }

    onListen() {
        bot.on("hardcodedSoundEffectHeard", async (soundId: number,
                                                   soundCategory: string | number,
                                                   position: Vec3,
                                                   volume: number,
                                                   pitch: number) => {
            if (soundCategory === "player" || soundCategory === "hostile" || soundCategory === "mob") {
                await bot.lookAt(position)
            }
        })
    }
}