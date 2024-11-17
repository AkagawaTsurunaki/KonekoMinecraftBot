import WebSocket from "ws";
import {getLogger} from "../util/logger";
import {plainToInstance} from "class-transformer";

const logger = getLogger("ZerolanPlugin");

class KonekoProtocol {
    protocol: string = "Koneko Protocol"
    version: string = "0.1"
    type: string = "hello"
    data: any
}

export const konekoProtocolVersion = "0.1"

export class ZerolanLiveRobotBridge {
    host: string;
    port: number;
    client: WebSocket;

    constructor() {
        this.host = "127.0.0.1";
        this.port = 10098;
        this.client = this.createWebsocketClient()

        this.client.onmessage = (e) => {
            logger.info(e)
            // Convert to Class instance
            const plainJson = JSON.stringify(e.data)
            const protocolObj = plainToInstance(KonekoProtocol, plainJson)
            if (protocolObj.protocol !== konekoProtocolVersion) {
                logger.fatal(`Koneko protocol version "${konekoProtocolVersion}" is not supported`)
                return
            }
            logger.info(protocolObj)

        }
    }

    public send(protocolObj: KonekoProtocol) {
        this.client.send(JSON.stringify(protocolObj))
    }

    private createWebsocketClient() {
        return new WebSocket(`ws://${this.host}:${this.port}`)
    }

}