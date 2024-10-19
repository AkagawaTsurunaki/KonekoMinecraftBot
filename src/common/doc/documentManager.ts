import {getLogger} from "../../utils/logger";

import {InstructionDocument} from "./instructionDocument";
import {StateDocument} from "./stateDocument";

const logger = getLogger("DocumentManager")

export class DocumentManager {

    private static readonly statesDoc: Array<StateDocument> = new Array<StateDocument>()
    private static readonly instructionDoc: Array<InstructionDocument> = new Array<InstructionDocument>()

    public static generateStatesForm() {
        let result = "| State ID | Description | Issues |" + "\n"
        "|---|---|---|" + "\n";
        this.statesDoc.forEach(sd => {
            result += " | " + sd.name + " | " + sd.description + " | " + sd.issue + "| \n"
        })
        logger.info("Document of states generated.")
        logger.info(result)
        return result
    }

    public static generateInstructionsForm() {
        let result = "| Name | Usage | Description |" + "\n"
        "|---|---|---|" + "\n";
        this.instructionDoc.forEach(id => {
            result += " | " + id.name + " | " + id.usage + " | " + id.description + "| \n"
        })
        logger.info("Document of instructions generated.")
        logger.info(result)
        return result
    }

    public static addStateDoc(stateDoc: StateDocument) {
        this.statesDoc.push(stateDoc)
    }

    public static addInstructionDoc(instructionDoc: InstructionDocument) {
        this.instructionDoc.push(instructionDoc)
    }

}