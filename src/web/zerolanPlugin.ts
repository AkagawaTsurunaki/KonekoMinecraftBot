import WebSocket from "ws";
import {getLogger} from "../util/logger";
import {plainToInstance} from "class-transformer";
import {ToolCall} from "../agent/toolCall";
import {ExtendedBot} from "../extension/extendedBot";

const logger = getLogger("ZerolanPlugin");

class KonekoProtocol {
    protocol: string = "Koneko Protocol"
    version: string = "0.2"
    event: KonekoEventEnum = KonekoEventEnum.KONEKO_SERVER_HELLO
    data: any
}

export enum KonekoEventEnum {
    KONEKO_CLIENT_HELLO = "koneko.client.hello",
    KONEKO_CLIENT_PUSH_INSTRUCTIONS = "koneko.client.push_instructions",
    KONEKO_SERVER_HELLO = "koneko.server.hello",
    KONEKO_SERVER_FETCH_INSTRUCTIONS = "koneko.server.fetch_instructions",
    KONEKO_SERVER_CALL_INSTRUCTION = "koneko.server.call_instruction"
}

export const konekoProtocolVersion = "0.2"

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
            const protocolObj = this.validateProtocol(jsonObj)
            if (protocolObj) {
                logger.info(protocolObj)
                if (protocolObj.event === KonekoEventEnum.KONEKO_SERVER_CALL_INSTRUCTION) {
                    this.callInstructions(protocolObj)
                } else if (protocolObj.event === KonekoEventEnum.KONEKO_SERVER_FETCH_INSTRUCTIONS) {
                    this.pushInstructions()
                }
            }
        }
    }

    private callInstructions(data: any) {
        const toolCall = plainToInstance<ToolCall, object>(ToolCall, data as object);
        this.bot.events.emit("instructionCall", toolCall)
    }

    private pushInstructions() {
        const allInstructions: any = []
        const protocolObj = new KonekoProtocol()
        protocolObj.event = KonekoEventEnum.KONEKO_CLIENT_PUSH_INSTRUCTIONS
        protocolObj.data = allInstructions
        this.send(protocolObj)
    }

    private clientHello() {
        const protocolObj = new KonekoProtocol()
        protocolObj.event = KonekoEventEnum.KONEKO_CLIENT_HELLO
        this.send(protocolObj)
    }


    public validateProtocol(jsonObj: any) {
        const protocolObj = plainToInstance<KonekoProtocol, any>(KonekoProtocol, jsonObj)
        if (protocolObj.protocol !== "Koneko Protocol") {
            logger.error(`Only Koneko Protocol is supported.`)
            return;
        }

        if (protocolObj.version !== konekoProtocolVersion) {
            logger.fatal(`Koneko protocol version "${konekoProtocolVersion}" is not supported`)
            return
        }
        return protocolObj;
    }

    public send(protocolObj: KonekoProtocol) {
        this.client.send(JSON.stringify(protocolObj))
    }

    private createWebsocketClient() {
        const ws = new WebSocket(`ws://${this.host}:${this.port}`)
        this.clientHello()
        return ws
    }

}