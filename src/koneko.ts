import {createExtendedBot, ExtendedBot} from "./extension/extendedBot";
import {pathfinder} from "mineflayer-pathfinder";
import {plugin as pvp} from "mineflayer-pvp";
import {loader as autoEat} from "mineflayer-auto-eat";
import {getLogger} from "./util/logger";
import {CustomFSM} from "./fsm/impl/customFSM";
import {FSMImpl} from "./fsm/impl/fsmImpl";
import {AbstractBehaviour} from "./behaviour/abstractBehaviour";
import {FaceToSoundSourceBehaviour} from "./behaviour/faceToSoundSourceBehaviour";
import {AutoEatBehaviour} from "./behaviour/autoEatBehaviour";
import {DocumentManager} from "./common/doc/documentManager";
import {BotHurtEventEmitter} from "./extension/eventEmitter/botHurtEventEmitter";
import {DamageEventEventEmitter} from "./extension/eventEmitter/damageEventEmitter";
import {ExtendedEventEmitter} from "./extension/eventEmitter/extendedEventEmitter";
import {SecondEventEmitter} from "./extension/eventEmitter/secondEventEmitter";
import {MasterPlainChatEventEmitter} from "./extension/eventEmitter/masterPlainChatEventEmitter";
import {ZerolanLiveRobotBridge} from "./web/zerolanPlugin";
import {InstructionExecutor} from "./instruction/executor";
import {InstructionRegistry} from "./instruction/registry";
import {WebServer} from "./web/server";
import {genInstructions} from "./common/docGen";

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
    private zerolanPlugin: ZerolanLiveRobotBridge | undefined
    private instructionExecutor: InstructionExecutor
    private instructionRegistry: InstructionRegistry
    private server: WebServer;

    constructor() {
        logger.info("Loading config...")
        this.botOption = require("../resources/config/botOption.json")

        logger.info("Creating bot instance...")
        this.bot = createExtendedBot(this.botOption)

        this.server = new WebServer()

        this.fsm = new CustomFSM(this.bot, this.server)
        this.instructionRegistry = new InstructionRegistry(this.bot)
        const config = require("../resources/config/webServer.json")
        if (config.zerolanLiveRobot.enable) {
            this.zerolanPlugin = new ZerolanLiveRobotBridge(this.bot, this.instructionRegistry);
        }
        this.instructionExecutor = new InstructionExecutor(this.bot, this.instructionRegistry);
    }

    public start() {
        this.bot.once("login", () => {
            this.loadPlugins()
            this.startEventEmitters()
            this.initAllInstructions()
            this.enableBehaviours()
            this.startFiniteStateMachine()
            this.generateDocuments()
            this.server.startServer()

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
        const masterPlainChatEventEmitter = new MasterPlainChatEventEmitter(this.bot);

        this.eventEmitters.push(secondEventEmitter)
        this.eventEmitters.push(damageEventEventEmitter)
        this.eventEmitters.push(botHurtEventEmitter)
        this.eventEmitters.push(masterPlainChatEventEmitter)

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
        this.instructionExecutor.start()
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
        DocumentManager.generateStateDiagram(this.fsm)
        DocumentManager.generateStatesForm()
        genInstructions(this.instructionRegistry.asArray())
        DocumentManager.generateBehavioursForm()
    }

}