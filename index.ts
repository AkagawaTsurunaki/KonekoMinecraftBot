import {WebServer} from "./src/web/server";
import {Koneko} from "./src/koneko";

export const konekoMinecraftBot = new Koneko()
konekoMinecraftBot.start()

export const server = new WebServer()
server.startServer()
