import {Container} from "../common/container";
import {BaseInstruction} from "./instruction";
import {scanConstructorRecursively} from "../common/reflect";
import {getLogger} from "../util/logger";

const logger = getLogger("registry.ts")

export class InstructionRegistry extends Container<string, BaseInstruction> {

    public constructor() {
        super();
        const path = "D:\\AkagawaTsurunaki\\WorkSpace\\TypeScriptProjects\\KonekoMinecraftBot\\src";
        scanConstructorRecursively(path, cls => {
            const className: string = Reflect.getMetadata("instruction:class", cls);
            if (className) {
                const instance = new cls()
                this.register(className, instance as BaseInstruction);
            }
        })
        logger.info(`${this.registry.size} instructions registered.`)
    }
}
