import {bot} from "../index";
import {Entity} from "prismarine-entity";
import {findPlayerByUsername} from "../utils/helper";

export class AngryBehaviour {

    private playerAngryDict: { [key: string]: number } = {};
    private forgiveThr: number = 100;
    private attackThr: number = 200;
    private rileValue: number = 60;
    public pvpTarget: Entity | null = null

    constructor() {
        bot.on('physicsTick', () => {
            this.updatePvpTarget()
            this.tryForgivePlayer()
            this.propitiate(1)
        })

        // @ts-ignore
        bot.on('attackedTarget', () => {
            this.propitiate(30)
        })

        bot.on("death", () => {
            this.playerAngryDict = {}
            this.pvpTarget = null
        })

        bot.on("entityDead", (player: Entity) => {
            if (player && player.type == 'player' && player.username !== undefined) {
                this.playerAngryDict[player.username] = 0
            }
        })

        bot._client.on('damage_event', async (packet) => {
            const entityId = packet.entityId
            // const sourceTypeId = packet.sourceTypeId
            const sourceCauseId = packet.sourceCauseId
            // const sourceDirectId = packet.sourceDirectId
            if (entityId === bot.entity.id) {
                const sourceCauseEntity = bot.entities[sourceCauseId - 1]

                if (sourceCauseEntity) {
                    if (sourceCauseEntity.type === 'player') {
                        const playerName = sourceCauseEntity.username
                        if (playerName) {
                            this.rile(playerName)
                        }
                    } else if (sourceCauseEntity.type === 'hostile' || 'mob') {
                        this.propitiate()
                    }
                }
            }
        })
    }

    public rile(username: string) {
        if (!this.playerAngryDict[username]) {
            this.playerAngryDict[username] = 0
        }
        const pvpTarget = bot.pvp.target
        if (pvpTarget && pvpTarget.type === 'player') {
            pvpTarget.username = username
            this.playerAngryDict[username] += this.rileValue / 2
            if (bot.health < 20) {
                this.playerAngryDict[username] += this.rileValue * (21 - bot.health)
            }
        } else {
            this.playerAngryDict[username] += this.rileValue
        }
    }

    public propitiate(propitiateValue: number = this.rileValue) {
        propitiateValue = Math.abs(propitiateValue)
        for (const username in this.playerAngryDict) {
            this.playerAngryDict[username] = this.playerAngryDict[username] - propitiateValue
            if (this.playerAngryDict[username] < 0) {
                this.playerAngryDict[username] = 0
            }
        }
    }

    private tryForgivePlayer() {
        const pvpTarget = bot.pvp.target

        if (pvpTarget) {
            const username = pvpTarget.username
            const player = pvpTarget
            if (player && username && player.type == 'player') {
                // 愤怒值过低时饶恕玩家
                if (this.playerAngryDict[username] < this.forgiveThr) {
                    this.pvpTarget = null
                }
            }
        }
    }

    private getMaxAngryPlayer() {
        let maxValue = 0
        let username: string = ''
        for (const key in this.playerAngryDict) {
            if (maxValue < this.playerAngryDict[key]) {
                maxValue = this.playerAngryDict[key]
                username = key
            }
        }
        return {username: username, maxValue: maxValue}
    }

    private updatePvpTarget() {
        const {username, maxValue} = this.getMaxAngryPlayer()
        if (username) {
            const maxAngryValuePlayer = findPlayerByUsername(username)
            if (maxAngryValuePlayer && maxValue > this.attackThr) {
                this.pvpTarget = maxAngryValuePlayer
            }
        }

    }
}