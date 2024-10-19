import {createExtendedBot, ExtendedBot} from "./extension/extendedBot";
import {pathfinder} from "mineflayer-pathfinder";
import {plugin as pvp} from "mineflayer-pvp";
import {loader as autoEat} from "mineflayer-auto-eat";
import {getLogger} from "./utils/logger";
import {SecondEventEmitter} from "./events/secondEvent";
import {DamageEventEventEmitter} from "./events/damageEvent";
import {BotHurtEventEmitter} from "./events/botHurtEvent";
import {ExtendedEventEmitter} from "./events/extendedBotEvents";
import {CustomFSM} from "./fsm/impl/customFSM";
import {FSMImpl} from "./fsm/impl/fsmImpl";
import {DocGenerator} from "./common/mermaid";
import {AbstractBehaviour} from "./behaviours/abstractBehaviour";
import {FaceToSoundSourceBehaviour} from "./behaviours/faceToSoundSourceBehaviour";
import {AutoEatBehaviour} from "./behaviours/autoEatBehaviour";
import {QuitInstruction} from "./instruction/impl/quitInstruction";
import {StopInstruction} from "./instruction/impl/stopInstruction";
import {SowInstruction} from "./instruction/impl/sowInstruction";
import {HarvestInstruction} from "./instruction/impl/harvestInstruction";
import {instructionRegistry} from "./instruction/instruction";
import {DocumentManager} from "./common/doc/documentManager";

const logger = getLogger("Koneko")

export class Koneko {
    protected bot: ExtendedBot
    protected botOption: {
        "host": string,
        "port": number,
        "username": string,
        "version": string,
        "masterName": string
    }
    protected fsm: FSMImpl
    protected eventEmitters: Array<ExtendedEventEmitter> = new Array<ExtendedEventEmitter>()
    protected behaviours: Array<AbstractBehaviour> = new Array<AbstractBehaviour>()

    constructor() {
        logger.info("Loading config...")
        this.botOption = require("../resources/config/botOption.json")

        logger.info("Creating bot instance...")
        this.bot = createExtendedBot(this.botOption)
        this.fsm = new CustomFSM(this.bot)
    }

    public start() {
        this.bot.once("login", () => {
            this.listenUnhandledError()
            this.loadPlugins()
            this.startEventEmitters()
            this.initAllInstructions()
            this.enableBehaviours()
            this.startFiniteStateMachine()
            this.generateDocuments()

            logger.info(`Koneko Minecraft Bot is running!`)
        })
    }

    /**
     * Load all plugins.
     */
    loadPlugins() {
        this.bot.loadPlugin(pathfinder)
        this.bot.loadPlugin(pvp)
        this.bot.loadPlugin(autoEat)
        logger.info(`All plugins loaded.`)
    }

    startEventEmitters() {
        // Start custom event emitters.
        const secondEventEmitter = new SecondEventEmitter(this.bot);
        const damageEventEventEmitter = new DamageEventEventEmitter(this.bot);
        const botHurtEventEmitter = new BotHurtEventEmitter(this.bot);

        this.eventEmitters.push(secondEventEmitter)
        this.eventEmitters.push(damageEventEventEmitter)
        this.eventEmitters.push(botHurtEventEmitter)

        logger.info(`Extended event emitter started.`)
    }

    /**
     * Enable self behaviours (they are not controlled by FSM).
     */
    enableBehaviours() {
        const faceToSoundSourceBehaviour = new FaceToSoundSourceBehaviour(this.bot);
        const autoEatBehaviour = new AutoEatBehaviour(this.bot);
        this.behaviours.push(faceToSoundSourceBehaviour)
        this.behaviours.push(autoEatBehaviour)
    }

    initAllInstructions() {
        const quit = new QuitInstruction(this.bot)
        const stop = new StopInstruction(this.bot)
        const sow = new SowInstruction(this.bot)
        const harvest = new HarvestInstruction(this.bot)

        instructionRegistry.set(quit.command, quit)
        instructionRegistry.set(stop.command, stop)
        instructionRegistry.set(sow.command, sow)
        instructionRegistry.set(harvest.command, harvest)
    }

    /**
     * Start finite state machine.
     */
    startFiniteStateMachine() {
        this.fsm.init()
        this.fsm.start()
        logger.info(`Finite state machine started.`)
    }

    /**
     * Generate documents
     */
    generateDocuments() {
        DocGenerator.generateStateDiag(this.fsm)
        DocumentManager.generateStatesForm()
        DocumentManager.generateInstructionsForm()
    }

    listenUnhandledError() {
        this.bot.on("error", (e: any) => {
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
    }

}