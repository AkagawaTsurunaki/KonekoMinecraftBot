import {StateDocument} from "./stateDocument";
import {getLogger} from "../utils/logger";

const logger = getLogger("DocumentManager")

export class DocumentManager {

    private static readonly statesDoc: Array<StateDocument> = new Array<StateDocument>()

    public static generateForm() {
        let result = "| State ID | Description | Issues |" + "\n"
        "|---|---|---|" + "\n";
        this.statesDoc.forEach(sd => {
            result += " | " + sd.name + " | " + sd.description + " | " + sd.issue + "| \n"
        })
        logger.info("Document of states generated.")
        logger.info(result)
        return result
    }

    public static addStateDoc(stateDoc: StateDocument) {
        this.statesDoc.push(stateDoc)
    }

}