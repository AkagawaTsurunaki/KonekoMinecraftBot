import {BaseInstruction} from "../instruction/instruction";
import {getLogger} from "../util/logger";

const logger = getLogger("Container")

export class Container<K, V> {
    private registry: Map<K, V>

    public constructor() {
        this.registry = new Map<K, V>();
    }

    public register(key: K, value: V) {
        if (this.registry.has(key)) {
            logger.warn(`Duplicated registry key: ${key}`)
            return
        }
        this.registry.set(key, value)
    }
}

export const instructionContainer = new Container<string, BaseInstruction>()