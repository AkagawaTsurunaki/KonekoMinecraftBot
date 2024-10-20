import {createExtendedBot, ExtendedBot} from "./extension/extendedBot";
import {pathfinder} from "mineflayer-pathfinder";
import {plugin as pvp} from "mineflayer-pvp";
import {loader as autoEat} from "mineflayer-auto-eat";
import {getLogger} from "./util/logger";
import {CustomFSM} from "./fsm/impl/customFSM";
import {FSMImpl} from "./fsm/impl/fsmImpl";
import {DocGenerator} from "./common/mermaid";
import {AbstractBehaviour} from "./behaviour/abstractBehaviour";
import {FaceToSoundSourceBehaviour} from "./behaviour/faceToSoundSourceBehaviour";
import {AutoEatBehaviour} from "./behaviour/autoEatBehaviour";
import {QuitInstruction} from "./instruction/impl/quitInstruction";
import {StopInstruction} from "./instruction/impl/stopInstruction";
import {SowInstruction} from "./instruction/impl/sowInstruction";
import {HarvestInstruction} from "./instruction/impl/harvestInstruction";
import {instructionRegistry} from "./instruction/instruction";
import {DocumentManager} from "./common/doc/documentManager";
import {BotHurtEventEmitter} from "./extension/eventEmitter/botHurtEventEmitter";
import {DamageEventEventEmitter} from "./extension/eventEmitter/damageEventEmitter";
import {ExtendedEventEmitter} from "./extension/eventEmitter/extendedEventEmitter";
import {SecondEventEmitter} from "./extension/eventEmitter/secondEventEmitter";
import {TossInstruction} from "./instruction/impl/tossInstruction";

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

    /**
     * Start all extended emitters.
     */
    startEventEmitters() {
        // Register custom event emitters.
        const secondEventEmitter = new SecondEventEmitter(this.bot);
        const damageEventEventEmitter = new DamageEventEventEmitter(this.bot);
        const botHurtEventEmitter = new BotHurtEventEmitter(this.bot);

        this.eventEmitters.push(secondEventEmitter)
        this.eventEmitters.push(damageEventEventEmitter)
        this.eventEmitters.push(botHurtEventEmitter)

        // Start the emitters.
        this.eventEmitters.forEach(emitter => {
            emitter.startEventEmitter()
        })

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
        const toss = new TossInstruction(this.bot)

        instructionRegistry.set(quit.command, quit)
        instructionRegistry.set(stop.command, stop)
        instructionRegistry.set(sow.command, sow)
        instructionRegistry.set(harvest.command, harvest)
        instructionRegistry.set(toss.command, toss)
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
        DocumentManager.generateBehavioursForm()
    }

}