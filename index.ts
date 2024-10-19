import {Koneko} from "./src/koneko";
import {getLogger} from "./src/util/logger";

const logger = getLogger("koneko.ts")

logger.info("Koneko Minecraft Bot initializing...")

const konekoMinecraftBot = new Koneko()
konekoMinecraftBot.start()

logger.info("Koneko Minecraft Bot exited.")