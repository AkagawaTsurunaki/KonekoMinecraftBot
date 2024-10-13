import {goals, pathfinder} from "mineflayer-pathfinder";
import {plugin as pvp} from "mineflayer-pvp";
import {Vec3} from "vec3";
import {getLogger} from "./src/utils/logger";
import {botOption, masterName} from "./src/common/const";
import {startSecondEvent} from "./src/events/secondEvent";
import {startDamageEvent} from "./src/events/damageEvent";
import {startBotDamageEvent} from "./src/events/botHurtEvent";
import {myEmitter} from "./src/events/extendedBotEvents";
import {createExtendedBot} from "./src/extension/extendedBot";

const logger = getLogger("index")
export const bot = createExtendedBot(botOption)

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
    // new MermaidGenerator().generate(newFsm)

    logger.info(`${bot.username} is running.`)
}

bot.once("spawn", () => {
    initKoneko()
});


bot.on("chat", async (username, message, translate, jsonMsg) => {
    if (username === masterName && message === "quit") {
        bot.chat("那我走喵~")
        bot.quit(`${masterName} asked you to quit.`)
    } else if (username === masterName && message === "test") {

    }
})
// If the bot is on fire, try to find the nearest water block
myEmitter.on("botDamageEvent", async (sourceType, sourceCause, sourceDirect) => {
    if (["on_fire", "in_fire"].includes(sourceType.name)) {
        if (bot.game.dimension === "the_nether") {
            // Can not find water block in the nether expect use command /setblock or /fill
            logger.warn("No water block exists in `the_nether` dimension.")
            return
        }
        const water = bot.findBlock({
            point: bot.entity.position,
            matching: block => block.name === "water",
            count: 1,
            maxDistance: 64
        });
        if (!water) {
            logger.warn("Can not find the water block nearby.")
            return;
        }

        const goalBlock = new goals.GoalBlock(water.position.x, water.position.y, water.position.z);
        // try {
        //     if (bot.pathfinder.isMoving()) return;
        //
        //     await bot.pathfinder.goto(goalBlock, error => {
        //         logger.error(error)
        //     })
        // } catch (e: any) {
        //     logger.error(e)
        // }

    }
})


bot.on("physicsTick", () => {
    if (bot.isOnFire()) {
        logger.info("Entity is on fire")
    }
})

bot.on("hardcodedSoundEffectHeard", async (soundId: number,
                                           soundCategory: string | number,
                                           position: Vec3,
                                           volume: number,
                                           pitch: number) => {
    if (soundCategory === "player" || soundCategory === "hostile" || soundCategory === "mob") {
        await bot.lookAt(position)
    }
})