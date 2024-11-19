import {WebServer} from "./src/web/server";
import {Koneko} from "./src/koneko";

function main() {
    const konekoMinecraftBot = new Koneko()
    konekoMinecraftBot.start()

    const server = new WebServer()
    server.startServer()
}
