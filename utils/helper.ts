import {bot} from "../index";
import {Entity} from "prismarine-entity";

export function findPlayerByUsername(username: string): Entity {
    if (bot && username) {
        for (const id in bot.entities) {
            const e = bot.entities[id]
            if (e.username && e.username === username) {
                return e
            }
        }
    }

    return null
}