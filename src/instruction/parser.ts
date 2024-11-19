import {getLogger} from "../util/logger";

const logger = getLogger("StrictParser")

export class StrictParser {

    constructor() {
    }

    parse(str: string) {
        throw new Error("Not implemented");
    }
}