import {pathfinder} from "mineflayer-pathfinder";
import {plugin as pvp} from "mineflayer-pvp";
import {loader as autoEat} from "mineflayer-auto-eat"
import {getLogger} from "./src/utils/logger";
import {createExtendedBot} from "./src/extension/extendedBot";
import {FaceToSoundSource} from "./src/behaviours/faceToSoundSource";
import {AutoEat} from "./src/behaviours/autoEat";
import {ChatMessage} from "prismarine-chat";
import {StrictParser} from "./src/instruction/parser";
import {instructionRegistry} from "./src/instruction/instruction";
import {CustomFSM} from "./src/fsm/impl/customFSM";
import {DocGenerator} from "./src/common/mermaid";
import {DocumentManager} from "./src/document/documentManager";
import {SecondEventEmitter} from "./src/events/secondEvent";
import {DamageEventEventEmitter} from "./src/events/damageEvent";
import {BotHurtEventEmitter} from "./src/events/botHurtEvent";

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
    const secondEventEmitter = new SecondEventEmitter(bot);
    const damageEventEventEmitter = new DamageEventEventEmitter(bot);
    const botHurtEventEmitter = new BotHurtEventEmitter(bot);

    secondEventEmitter.startEventEmitter()
    damageEventEventEmitter.startEventEmitter()
    botHurtEventEmitter.startEventEmitter()
    logger.info(`Extended event emitter started.`)

    // Start finite state machine.
    const fsm = new CustomFSM()
    fsm.init()
    fsm.start()
    logger.info(`Finite state machine started.`)

    // Generate documents
    DocGenerator.generateStateDiag(fsm)
    DocumentManager.generateStatesForm()
    DocumentManager.generateInstructionsForm()

    // Some behaviours
    behaviours.push(new FaceToSoundSource())
    behaviours.push(new AutoEat())

    logger.info(`${bot.username} is running.`)
}

bot.once("login", () => {
    initKoneko()
});

bot.on("chat", async (
    username: string,
    message: string,
    translate: string | null,
    jsonMsg: ChatMessage,
    matches: string[] | null
) => {
    if (username === botOption.masterName) {
        const parser = new StrictParser()
        const {command, args} = parser.parse(message)
        if (instructionRegistry.get(command)) {

        }
    }
    // const command = message.split(" ")
    // const fishingSkill = new FishingSkill();
    // if (message === 'fish') {
    //     await fishingSkill.startFishing()
    // } else if (message === "stop") {
    //     fishingSkill.stopFishing()
    // } else if (/^toss \w+ \d+$/.test(message)) {
    //     const amount = Number(command[2])
    //     // await tossItem(command[1], amount === 0 ? null : amount)
    // }
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