import {Container} from "../common/container";
import {BaseInstruction} from "./instruction";
import {registerClasses} from "../common/reflect";
import {getLogger} from "../util/logger";

const logger = getLogger("InstructionRegistry")

class InstructionRegistry extends Container<string, BaseInstruction> {

    constructor() {
        super();
        const instances = registerClasses("D:\\AkagawaTsurunaki\\WorkSpace\\TypeScriptProjects\\KonekoMinecraftBot\\src\\instruction\\impl")
        instances.forEach(instance => {
            const className: string = Reflect.getMetadata("instruction:class", instance.constructor);
            this.register(className, instance as BaseInstruction);
        })
        logger.info(`${this.registry.size} instructions registered.`)
    }
}

export const instructionRegistry = new InstructionRegistry();