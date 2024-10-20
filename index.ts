import {getLogger} from "./src/util/logger";
import {WebServer} from "./src/web/server";
import {Koneko} from "./src/koneko";

const logger = getLogger("koneko.ts")

logger.info("Koneko Minecraft Bot initializing...")

const konekoMinecraftBot = new Koneko()
konekoMinecraftBot.start()

export const server = new WebServer()
server.startServer()

logger.info("Koneko Minecraft Bot exited.")