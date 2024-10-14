import {pathfinder} from "mineflayer-pathfinder";
import {plugin as pvp} from "mineflayer-pvp";
import {getLogger} from "./src/utils/logger";
import {botOption, masterName} from "./src/common/const";
import {startSecondEvent} from "./src/events/secondEvent";
import {startDamageEvent} from "./src/events/damageEvent";
import {startBotDamageEvent} from "./src/events/botHurtEvent";
import {createExtendedBot} from "./src/extension/extendedBot";
import {FaceToSoundSource} from "./src/behaviours/faceToSoundSource";
import {ObserveBlockCognition} from "./src/cognition/observeBlockCognition";

const logger = getLogger("index")
export const bot = createExtendedBot(botOption)
const behaviours = []
const cognitions = []

function initKoneko() {
    logger.info(`Login at ${botOption.host}:${botOption.port}`)

    // Load all plugins.
    bot.loadPlugin(pathfinder)
    bot.loadPlugin(pvp)
    logger.info(`All plugins loaded.`)

    // Start custom event emitters.
    startSecondEvent()
    startDamageEvent()
    startBotDamageEvent()
    logger.info(`Extended event emitter started.`)

    // Start finite state machine.
    // const fsm = new CustomFSM()
    // fsm.init()
    // fsm.start()
    // logger.info(`Finite state machine started.`)
    // MermaidGenerator.generate(fsm)

    // Some behaviours
    behaviours.push(new FaceToSoundSource())

    cognitions.push(new ObserveBlockCognition("water"))


    logger.info(`${bot.username} is running.`)
}

bot.once("login", () => {
    initKoneko()
});


bot.on("chat", async (username, message, translate, jsonMsg) => {
    if (username === masterName && message === "quit") {
        bot.chat("那我走喵~")
        bot.quit(`${masterName} asked you to quit.`)
    } else if (username === masterName && message === "test") {
    }
})


