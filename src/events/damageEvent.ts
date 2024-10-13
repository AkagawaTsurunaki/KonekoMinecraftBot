/**
 * @Author: AkagawaTsrunaki
 *
 * More information:
 * - What is damage type: https://minecraft.wiki/w/Damage_type
 * - Protocol of damage event: https://wiki.vg/Protocol#Damage_Event
 * - Available default registries: https://wiki.vg/Registry_Data#Damage_Type
 * - Download "registry_data.json": https://gist.github.com/WinX64/2d257d3df3c7ab9c4b02dc90be881ab2
 */

import {bot} from "../../index";
import {myEmitter} from "./extendedBotEvents";
import assert from "node:assert";
import {botOption} from "../common/const";


export class DamageType {
    public readonly element: {
        exhaustion: number,
        messageId: string
        scaling: string
    }
    public readonly id: number
    public readonly name: string


    constructor(element: { exhaustion: number; messageId: string; scaling: string }, id: number, name: string) {
        this.element = element;
        this.id = id;
        this.name = name;
    }
}

/**
 * @Note: Default Minecraft version is 1.20.1, download from https://gist.github.com/WinX64/2d257d3df3c7ab9c4b02dc90be881ab2.
 * You should download the corresponding version of protocol json file by yourself.
 */
const protocol = require(`../protocol/ver${botOption.version}/registry_data.json`)
const damageTypeMap: Map<number, DamageType> = loadProtocolDamageTypes()
/**
 * The enum of damage type (string => number).
 * @Note: `damage_type.json` should be generated by yourself.
 */
export const damageTypes = require(`./src/protocol/ver${botOption.version}/damage_type.json`);

/**
 * Load registry data from the corresponding version of `registry_data.json` and parse the damage type data.
 */
function loadProtocolDamageTypes() {
    const result = new Map<number, DamageType>;
    protocol["minecraft:damage_type"].value.forEach((v: {
        element: {
            exhaustion: number,
            message_id: string
            scaling: string
        }, id: number, name: string
    }) => {
        const key = v.id
        const value = new DamageType({
            exhaustion: v.element.exhaustion,
            messageId: v.element.message_id,
            scaling: v.element.scaling
        }, v.id, v.name);
        result.set(key, value);
    })
    return result;
}

/**
 * See: https://wiki.vg/Protocol#Damage_Event
 */
export function startDamageEvent() {
    bot._client.on('damage_event', async (packet) => {
        // The ID of the entity taking damage.
        const entityId = packet.entityId;
        // The entity taking damage.
        const entity = bot.entities[entityId];

        // The type of damage in the minecraft:damage_type registry, defined by the Registry Data packet.
        const sourceTypeId = packet.sourceTypeId;
        const sourceType = damageTypeMap.get(sourceTypeId);
        assert(sourceType, `Server should not send this damage type id: ${sourceTypeId}`)

        // The ID + 1 of the entity responsible for the damage, if present. If not present, the value is 0
        const sourceCauseId = packet.sourceCauseId;
        const sourceCause = sourceCauseId === 0 ? null : bot.entities[sourceCauseId - 1];

        // The ID + 1 of the entity that directly dealt the damage, if present. If not present, the value is 0.
        // If this field is present:
        // - and damage was dealt indirectly, such as by the use of a projectile, this field will contain the ID of such projectile;
        // - and damage was dealt directly, such as by manually attacking, this field will contain the same value as Source Cause ID.
        const sourceDirectId = packet.sourceDirectId;
        const sourceDirect = bot.entities[sourceDirectId - 1];

        // Enhance the raw damage_event event emitter.
        myEmitter.emit("damageEvent", entity, sourceType, sourceCause, sourceDirect)

        // Replace the original entityHurt event emitter.
        myEmitter.emit("entityHurt", entity)
    })
}