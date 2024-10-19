import {instructionRegistry} from "./instruction";
import {getLogger} from "../utils/logger";

const logger = getLogger("StrictParser")

export class StrictParser {

    constructor() {
    }

    parse(str: string) {
        const strings = str.split(/\s+/);
        const instruction = instructionRegistry.get(str)
        if (!instruction) {
            throw Error(`Failed to parse ${instruction}: No such instruction found.`)
        }
        if (strings.length >= 2) {
            const args = strings.slice(1)

            const argTypes = instruction.argTypes;
            if (args.length === instruction.args?.length && argTypes) {
                let typedArgs = []
                for (let i = 0; i < args.length; i++) {
                    if (argTypes[i] === "string") {
                        typedArgs.push(instruction.args[i])
                    } else if (argTypes[i] === "number") {
                        typedArgs.push(Number(instruction.args[i]))
                    } else if (argTypes[i] === "boolean") {
                        typedArgs.push(Boolean(instruction.args[i]))
                    }
                }
                logger.info(`Parse instruction: ${instruction.command} ${typedArgs}`)
                return {
                    command: instruction.command,
                    args: typedArgs
                }
            }
        }
        return {
            command: instruction.command,
            args: []
        }

    }
}