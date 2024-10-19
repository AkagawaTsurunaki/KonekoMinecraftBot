import {pathfinder} from "mineflayer-pathfinder";
import {plugin as pvp} from "mineflayer-pvp";
import {loader as autoEat} from "mineflayer-auto-eat"
import {getLogger} from "./src/utils/logger";
import {startSecondEvent} from "./src/events/secondEvent";
import {startDamageEvent} from "./src/events/damageEvent";
import {startBotDamageEvent} from "./src/events/botHurtEvent";
import {createExtendedBot} from "./src/extension/extendedBot";
import {FaceToSoundSource} from "./src/behaviours/faceToSoundSource";
import {CustomFSM} from "./src/fsm/impl/customFSM";
import {DocGenerator} from "./src/common/mermaid";
import {AutoEat} from "./src/behaviours/autoEat";

export const botOption: {
    "host": string,
    "port": number,
    "username": string,
    "version": string,
    "masterName": string
} = require("./resources/config/botOption.json")

const logger = getLogger("index")
export const bot = createExtendedBot(botOption)
const behaviours = []

function initKoneko() {
    logger.info(`Login at ${botOption.host}:${botOption.port}`)

    // Load all plugins.
    bot.loadPlugin(pathfinder)
    bot.loadPlugin(pvp)
    bot.loadPlugin(autoEat)
    logger.info(`All plugins loaded.`)

    // Start custom event emitters.
    startSecondEvent()
    startDamageEvent()
    startBotDamageEvent()
    logger.info(`Extended event emitter started.`)

    // Start finite state machine.
    const fsm = new CustomFSM()
    fsm.init()
    fsm.start()
    logger.info(`Finite state machine started.`)

    // Generate documents
    DocGenerator.generateStateDiag(fsm)
    DocGenerator.generateForm(fsm)

    // Some behaviours
    behaviours.push(new FaceToSoundSource())
    behaviours.push(new AutoEat())

    logger.info(`${bot.username} is running.`)
}

bot.once("login", () => {
    initKoneko()
});

bot.on("error", (e: any) => {
    if (e.errno === -3008) {
        logger.fatal("DNS error: \n" +
            "Are you sure the address of the server is right?")
    } else if (e.errno === -4077) {
        logger.fatal("Protocol version conflict: \n" +
            "The Minecraft server does not correspond to your client version.")
    } else if (e.errno === -4078) {
        logger.fatal("Failed to connect the server:\n" +
            " Possible solutions: \n" +
            "1. Check if your host and port are right. \n" +
            "2. Check if your Minecraft client (not bot) can join the game.")
    } else if (e.errno === -4079) {
        logger.fatal("Generic error: \n" +
            "See detail")
    } else {
        logger.fatal("Unhandled error: \n" +
            "I have no idea to deal with it except crashed, sorry nya...")
    }

    // Can not handle this situation. Crashed!
    throw e
})