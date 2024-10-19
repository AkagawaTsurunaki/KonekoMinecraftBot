export class InstructionDocument {
    name: string
    description: string
    usage: string


    constructor(name: string, description: string, usage: string) {
        this.name = name;
        this.description = description;
        this.usage = usage;
    }
}