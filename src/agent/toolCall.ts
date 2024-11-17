export class ToolCall {
    id: string;
    name: string;
    args: Map<string, any>


    constructor(id: string, name: string, args: Map<string, any>) {
        this.id = id;
        this.name = name;
        this.args = args;
    }
}

export class ParameterProperty {
    description: string;
    name: string;
    type: string;
    isRequired: boolean;


    constructor(description: string, name: string, type: string, isRequired: boolean) {
        this.description = description;
        this.name = name;
        this.type = type;
        this.isRequired = isRequired;
    }
}

export class Tool {
    "type": string;
    "function": {
        name: string;
        description: string;
        parameters: {
            properties: Map<string, { description: string, type: string }>,
            required: Array<string>,
            type: string,
        }
    }

    constructor(name: string, description: string, parameters: Array<ParameterProperty>, parametersType: string) {
        this.type = "function";
        const properties = new Map();
        const required = new Array<string>();
        for (const parameter of parameters) {
            if (parameter.isRequired)
                properties.set(parameter.name, {description: parameter.description, type: parameter.type});
            else
                required.push(parameter.name);
        }
        this.function = {
            name: name,
            description: description,
            parameters: {
                properties: properties,
                required:required,
                type: parametersType
            }
        }
    }
}