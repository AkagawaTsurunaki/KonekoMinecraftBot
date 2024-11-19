import 'reflect-metadata';
import * as fs from 'fs';
import * as path from 'path';
import {getLogger} from "../util/logger";

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