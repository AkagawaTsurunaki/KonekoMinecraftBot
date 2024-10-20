import {instructionRegistry} from "./instruction";
import {getLogger} from ".././util/logger";

const logger = getLogger("StrictParser")

export class StrictParser {

    constructor() {
    }

    parse(str: string) {
        const strings = str.split(/\s+/);
        const instruction = instructionRegistry.get(strings[0])
        if (!instruction) {
            throw Error(`Failed to parse ${instruction}: No such instruction found.`)
        }
        if (strings.length >= 2) {
            const args = strings.slice(1)

            const argTypes = instruction.argTypes;
            if (instruction.args && argTypes) {
                let typedArgs = []
                for (let i = 0; i < args.length; i++) {
                    try {
                        const arg = strings[i + 1];
                        if (argTypes[i] === "string") {
                            typedArgs.push(arg)
                        } else if (argTypes[i] === "number") {
                            typedArgs.push(Number(arg))
                        } else if (argTypes[i] === "boolean") {
                            typedArgs.push(Boolean(arg))
                        }
                    } catch (e) {
                        typedArgs.push(undefined)
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