import {AbstractState} from "../../abstractState";
import {getLogger} from "../../../util/logger";
import {range} from "../../../common/decorator/range";
import {ExtendedBot} from "../../../extension/extendedBot";
import {sleep} from "../../../util/sleep";
import {createLevelFuncByArray} from "../../../util/math";
import {lock} from "../../../common/decorator/lock";
import {BEGINNING_OF_NIGHT} from "../../../common/const";

const logger = getLogger("LoveState")

export class LoveState extends AbstractState {
    constructor(bot: ExtendedBot) {
        super("LoveState", bot);
    }

    private ruttingValue: number = 100
    private freqLevelFunc = createLevelFuncByArray(
        [-Infinity, 100, 140, 180, 200, Infinity],
        [0, 1000, 800, 600, 300]
    )


    @range(0, 0.5)
    getTransitionValue(): number {
        const isFullMoonPhase = this.bot.time.moonPhase === 4;
        const noHostileAround = this.bot.skills.attack.findNearestHostile(32) === null;
        const enoughBeds = this.bot.skills.sleep.findBedBlocks(16, 6).length > 2;
        const isNight = this.bot.time.timeOfDay > BEGINNING_OF_NIGHT;
        const distanceToMaster = this.bot.utils.distanceToMaster()
        if (isFullMoonPhase && noHostileAround && enoughBeds && isNight) {
            if (distanceToMaster < 16) {
                return (16 - distanceToMaster) / 16;
            }
        }
        return 0
    }

    onEnter() {
        super.onEnter();
        logger.warn("To enable particles effect made by bot, please set it as operator of your server.")
    }

    @lock()
    private async doLove(after: () => Promise<void> | void) {
        while (this.ruttingValue >= 100) {
            logger.debug(`ruttingValue: ${this.ruttingValue}`)
            this.bot.setControlState("sneak", true)
            this.bot.chat(`/particle minecraft:heart ~ ~ ~ 1 1 1 0 ${Math.round(this.ruttingValue / 10)} normal`)
            const sleepTime = this.freqLevelFunc(this.ruttingValue)
            logger.debug(`sleepTime: ${sleepTime}`)
            await sleep(sleepTime)
            this.bot.setControlState("sneak", false)
            this.ruttingValue += 5

            if (this.ruttingValue >= 300) {
                this.ruttingValue = 0;
                this.bot.chat("I kuu!")
                await this.splash()
                await after()
            }
        }
    }


    private async splash() {
        for (let i = 0; i < 5; i++) {
            this.bot.chat(`/particle minecraft:splash ~ ~ ~ 0.1 0.5 0.1 1 ${i * 200}`)
            await sleep(500)
        }
    }

    async onUpdate() {
        super.onUpdate();
        const master = this.bot.players[this.bot.option.masterName];
        this.bot.chat(`/particle minecraft:heart ~ ~ ~ 0.3 1 0.3 0 5 normal`)
        if (master) {
            // Do love
            logger.debug("Master found.")
            const dist = master.entity.position.distanceTo(this.bot.entity.position)
            if (dist > 32) return

            if (dist > 1) {
                logger.debug("Close to master")
                await this.bot.skills.follow.followNearestPlayer(0, true)
            } else {
                await this.doLove(() => {
                        this.bot.chat("/summon minecraft:cat ~ ~ ~")
                    }
                )
            }
        } else {
            // Onanii
            await this.doLove(async () => {
                this.bot.chat(`/give @s minecraft:cat_spawn_egg 1`)
            })
        }
    }

    onExit() {
        super.onExit();
    }

}