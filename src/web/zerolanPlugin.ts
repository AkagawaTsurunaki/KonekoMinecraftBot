import WebSocket from "ws";
import {getLogger} from "../util/logger";
import {instanceToPlain, plainToInstance} from "class-transformer";
import {ParameterProperty, Tool, ToolCall} from "../agent/toolCall";
import {ExtendedBot} from "../extension/extendedBot";
import {getFieldMetadata} from "../common/fieldMetadata";
import {InstructionRegistry} from "../instruction/registry";

const logger = getLogger("ZerolanPlugin");

class KonekoProtocol {
    protocol: string = "ZerolanProtocol"
    version: string = "1.1"
    message: string = KonekoEventEnum.KONEKO_SERVER_HELLO
    action: string = ""
    code: number = 0
    data: any = {}
}

export enum KonekoEventEnum {
    KONEKO_CLIENT_HELLO = "koneko.client.hello",
    KONEKO_CLIENT_PUSH_INSTRUCTIONS = "koneko.client.push_instructions",
    KONEKO_SERVER_HELLO = "koneko.server.hello",
    KONEKO_SERVER_FETCH_INSTRUCTIONS = "koneko.server.fetch_instructions",
    KONEKO_SERVER_CALL_INSTRUCTION = "koneko.server.call_instruction"
}

export const zerolanProtocolVersion = "1.1"

export class ZerolanLiveRobotBridge {
    host: string;
    port: number;
    client: WebSocket;
    bot: ExtendedBot;
    private instructionRegistry: InstructionRegistry;

    constructor(bot: ExtendedBot, instructionRegistry: InstructionRegistry) {
        this.host = "127.0.0.1";
        this.port = 10098; // For FSM vision
        this.bot = bot;
        this.instructionRegistry = instructionRegistry
        this.client = this.createWebsocketClient()

        this.client.onmessage = (e) => {
            logger.info(e)
            // Convert to Class instance
            const jsonObj = JSON.parse(String(e.data))
            const protocolObj = this.validateProtocol(jsonObj)
            if (protocolObj) {
                logger.info(protocolObj)
                if (protocolObj.action === KonekoEventEnum.KONEKO_SERVER_CALL_INSTRUCTION) {
                    this.callInstructions(protocolObj.data)
                } else if (protocolObj.action === KonekoEventEnum.KONEKO_SERVER_FETCH_INSTRUCTIONS) {
                    this.pushInstructions()
                }
            }
        }

        this.bot.once("login", () => {
            this.clientHello()
        })
    }

    private callInstructions(data: any) {
        const toolCall = plainToInstance<ToolCall, object>(ToolCall, data as object);
        logger.info(toolCall);
        this.bot.events.emit("instructionCall", toolCall)
    }

    private pushInstructions() {
        const allInstructions = new Array<Tool>()
        this.instructionRegistry.registry.forEach((bi) => {
            const fieldMetadataList = getFieldMetadata(bi.inputSchema);
            const parameters = fieldMetadataList.map((fm) => {
                return new ParameterProperty(fm.description, fm.name, fm.type, fm.required)
            })
            const tool = new Tool(bi.name, bi.description, parameters, typeof bi)
            allInstructions.push(tool)
        })

        const protocolObj = new KonekoProtocol()
        protocolObj.action = KonekoEventEnum.KONEKO_CLIENT_PUSH_INSTRUCTIONS
        protocolObj.data = allInstructions
        this.send(protocolObj)
    }

    private clientHello() {
        const protocolObj = new KonekoProtocol()
        protocolObj.action = KonekoEventEnum.KONEKO_CLIENT_HELLO
        this.send(protocolObj)
    }


    public validateProtocol(jsonObj: any) {
        const protocolObj = plainToInstance<KonekoProtocol, any>(KonekoProtocol, jsonObj)
        if (protocolObj.protocol !== "ZerolanProtocol") {
            logger.error(`Only ZerolanProtocol is supported.`)
            return;
        }

        if (protocolObj.version !== zerolanProtocolVersion) {
            logger.fatal(`Zerolan Protocol Version "${zerolanProtocolVersion}" is not supported`)
            return
        }
        return protocolObj;
    }

    public send(protocolObj: KonekoProtocol) {
        const record = instanceToPlain<KonekoProtocol>(protocolObj)
        const jsonStr = JSON.stringify(record)
        this.client.send(jsonStr)
    }

    private createWebsocketClient() {
        // return new WebSocket(`ws://${this.host}:${this.port}`)
        logger.info(`Client will establish connection`)
        return new WebSocket(`ws://127.0.0.1:11007`, ["ZerolanProtocol"])
    }

}