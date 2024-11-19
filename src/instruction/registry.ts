import {Container} from "../common/container";
import {BaseInstruction} from "./instruction";
import {scanConstructorRecursively} from "../common/reflect";
import {getLogger} from "../util/logger";
import {ExtendedBot} from "../extension/extendedBot";

const logger = getLogger("registry.ts")

export class InstructionRegistry extends Container<string, BaseInstruction> {
    private readonly bot: ExtendedBot

    public constructor(bot: ExtendedBot) {
        super();
        this.bot = bot;
        scanConstructorRecursively(__dirname, cls => {
            const className: string = Reflect.getMetadata("instruction:class", cls);
            if (className) {
                const instance = new cls(this.bot) as BaseInstruction
                this.register(instance.name, instance);
            }
        })
        logger.info(`${this.registry.size} instructions registered.`)
    }
}
