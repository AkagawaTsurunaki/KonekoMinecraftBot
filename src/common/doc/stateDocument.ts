export class StateDocument {
    public readonly name: string
    public readonly description: string
    public readonly issue: string

    constructor(name: string, description: string, issue?: string | null) {
        this.name = name;
        this.description = description;
        this.issue = issue ? issue : "-";
    }
}