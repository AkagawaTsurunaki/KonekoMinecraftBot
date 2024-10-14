import assert from "node:assert";
import {myEmitter} from "../events/extendedBotEvents";
import {bot} from "../../index";
import {getLogger} from "../utils/logger";
import {ExtendedVec3} from "../extension/extendedVec3";

const logger = getLogger("PlacedLavaBlockCognition")

/**
 * Bot will observe the specific typed block and record the number and position of them.
 *
 * If you put a bucket of water on the ground, the water will spread around.
 * The bot will update their records of the water blocks (updated).
 * The water blockUpdate event emitted before `ObserveBlockCognition` was created will be ignored.
 */
export class ObserveBlockCognition {

    private readonly observeBlockName: string
    private updatedBlockPositions: Set<string>

    constructor(observeBlockName: string) {
        this.observeBlockName = observeBlockName
        this.updatedBlockPositions = new Set()
        this.onListen()
    }

    onListen() {
        logger.info(`Listening for blockUpdate for ${this.observeBlockName}`)
        bot.on("blockUpdate", (oldBlock, newBlock) => {
            assert(oldBlock)
            if (oldBlock.name !== this.observeBlockName && newBlock.name === this.observeBlockName) {
                const position = newBlock.position
                this.updatedBlockPositions.add(ExtendedVec3.of(position).toCommaSplitString())
            }
            if (oldBlock.name === this.observeBlockName && newBlock.name !== this.observeBlockName) {
                const position = oldBlock.position;
                this.updatedBlockPositions.delete(ExtendedVec3.of(position).toCommaSplitString())
            }
        })

        myEmitter.on("secondTick", () => {
            this.updatedBlockPositions.forEach(posStr => {
                const pos = ExtendedVec3.fromCommaSplitString(posStr)
                const blockAt = bot.blockAt(pos);
                assert(blockAt)
                if (blockAt.name !== this.observeBlockName) {
                    this.updatedBlockPositions.delete(posStr)
                }
            })
            logger.debug(`Block "${this.observeBlockName}" updated to: ${this.updatedBlockPositions.size}`)
        })
    }
}