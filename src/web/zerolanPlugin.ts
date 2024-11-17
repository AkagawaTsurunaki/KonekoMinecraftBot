import WebSocket from "ws";
import {getLogger} from "../util/logger";
import {plainToInstance} from "class-transformer";
import {ToolCall} from "../agent/toolCall";
import {ExtendedBot} from "../extension/extendedBot";

const logger = getLogger("ZerolanPlugin");

class KonekoProtocol {
    protocol: string = "Koneko Protocol"
    version: string = "0.1"
    type: "hello" | "instruction" = "hello"
    data: any
}

export const konekoProtocolVersion = "0.1"

export class ZerolanLiveRobotBridge {
    host: string;
    port: number;
    client: WebSocket;
    bot: ExtendedBot;

    constructor(bot: ExtendedBot) {
        this.host = "127.0.0.1";
        this.port = 10098;
        this.bot = bot;
        this.client = this.createWebsocketClient()

        this.client.onmessage = (e) => {
            logger.info(e)
            // Convert to Class instance
            const jsonObj = JSON.parse(String(e.data))
            const protocolObj = plainToInstance<KonekoProtocol, any>(KonekoProtocol, jsonObj)
            if (protocolObj.protocol !== "Koneko Protocol") {
                logger.error(`Only Koneko Protocol is supported.`)
                return;
            }

            if (protocolObj.version !== konekoProtocolVersion) {
                logger.fatal(`Koneko protocol version "${konekoProtocolVersion}" is not supported`)
                return
            }
            logger.info(protocolObj)

            if (protocolObj.type === "instruction") {
                // @ts-ignore
                const toolCall: ToolCall = plainToInstance<ToolCall, any>(ToolCall, protocolObj.data);
                bot.events.emit("instructionCall", toolCall)
            }

        }
    }

    public send(protocolObj: KonekoProtocol) {
        this.client.send(JSON.stringify(protocolObj))
    }

    private createWebsocketClient() {
        return new WebSocket(`ws://${this.host}:${this.port}`)
    }

}