// import "reflect-metadata"
//
// const currentInstructionProtocolVersion = "0.1"
//
//
// export class InstructionProtocol {
//     private version: string
//     private language: "zh" | "en" | "ja"
//     private instructions: any
//
//
//     constructor(version: string, language: "zh" | "en" | "ja", instructions: any) {
//         this.version = version;
//         this.language = language;
//         this.instructions = instructions;
//     }
// }
//
// function getInstructionRegistry(): Map<string, string> {
//     return new Map<string, string>()
// }
//
// class Instruction {
//     id: number
//     name: string
//     command: string
//     args: Map<string, string | number | boolean>
//
//     constructor(id: number, name: string, command: string, ...args: any) {
//         this.id = id;
//         this.name = name;
//         this.command = command;
//         for (const arg of args) {
//             console.log(args)
//         }
//     }
// }
//
// class InstructionParser {
//
//     private readonly registry: Map<string, string>
//
//     constructor() {
//         this.registry = getInstructionRegistry()
//     }
//
//     parse(str: string) {
//         const strings = str.split(/\s+/);
//         const command = this.registry.get(strings[0])
//         if (!command) throw Error(`Failed to parse ${command}: No such instruction found.`)
//         const args = strings.slice(1)
//
//     }
// }