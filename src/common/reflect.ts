import 'reflect-metadata';
import * as fs from 'fs';
import * as path from 'path';
import {getLogger} from "../util/logger";
import {ClassConstructor} from "class-transformer";

const logger = getLogger("reflect");

export function registerClasses(directory: string): object[] {
    const files = fs.readdirSync(directory);

    return files.map(file => {
        const filePath = path.join(directory, file);
        const module = require(filePath);
        for (const key in module) {
            if (typeof module[key] === 'function') {
                const Constructor = module[key];
                if (Constructor instanceof Function) {
                    const instance = new Constructor()
                    logger.debug(`Constructor ${Constructor.name} was called`)
                    return instance
                }
            }
        }
    });
}


export function scanConstructorRecursively(directory: string, callback: (cls: ClassConstructor<any>) => void): void {
    function traverseDirectory(dir: string): void {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                traverseDirectory(filePath);
            } else {
                try {
                    const module = require(filePath);
                    for (const key in module) {
                        if (typeof module[key] === 'function') {
                            const Constructor = module[key];
                            if (Constructor instanceof Function) {
                                logger.debug(`Constructor ${Constructor.name} was scanned`);
                                if (callback) {
                                    callback(Constructor)
                                }
                            }
                        }
                    }
                } catch (error) {
                    logger.error(`Error requiring module ${filePath}: ${error}`);
                }
            }
        });
    }

    traverseDirectory(directory);

}