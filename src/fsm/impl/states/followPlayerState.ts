import {getLogger} from "../../../utils/logger";
import {AbstractState} from "../../abstractState";
import {clamp} from "../../../utils/math";
import {stateDoc} from "../../../decorator/stateDoc";
import {lock} from "../../../decorator/lock";
import {range} from "../../../decorator/range";
import {ExtendedBot} from "../../../extension/extendedBot";

const logger = getLogger("FollowPlayerState")

@stateDoc({
    name: "FollowPlayerState",
    description: "Follow the nearest player until the bot thinks it is close enough."
})
export class FollowPlayerState extends AbstractState {
    constructor(bot: ExtendedBot) {
        super("FollowPlayerState", bot);
    }

    /**
     * Radius of searching players. All players in this radius will be considered.
     * @private
     */
    private searchRadius = 128;
    /**
     * Radius of contacting players. Bot will not follow when nearest player is very close to the bot.
     * @private
     */
    private contactRadius = 10;

    @range(0, 1)
    getTransitionValue(): number {
        const player = this.bot.skills.follow.findNearestPlayer(0, this.searchRadius);
        // If not player around. State transition.
        if (player == null) return 0
        const dist = this.bot.entity.position.distanceTo(player.position)
        // Too close to follow. State transition
        if (dist <= this.contactRadius) return 0
        return clamp(dist / this.searchRadius, 0, 1)
    }

    @lock()
    async onUpdate() {
        super.onUpdate();
        logger.debug("Following nearest player...")
        await this.bot.skills.follow.followNearestPlayer(this.contactRadius, true)
        logger.debug("Followed nearest player.")
    }
}