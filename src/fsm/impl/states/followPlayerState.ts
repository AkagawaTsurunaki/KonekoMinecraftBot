import {getLogger} from "../../../utils/logger";
import {AbstractState} from "../../abstractState";
import {lock, range} from "../../../common/decorator";
import {FollowSkill} from "../../../skills/followSkill";
import {bot} from "../../../../index";
import {clamp} from "../../../utils/math";
import {stateDoc} from "../../../decorator/stateDoc";

const logger = getLogger("FollowPlayerState")

@stateDoc({
    name: "FollowPlayerState",
    description: "Follow the nearest player until the bot thinks it is close enough."
})
export class FollowPlayerState extends AbstractState {
    constructor() {
        super("FollowPlayerState");
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
        const player = FollowSkill.findNearestPlayer(0, this.searchRadius);
        // If not player around. State transition.
        if (player == null) return 0
        const dist = bot.entity.position.distanceTo(player.position)
        // Too close to follow. State transition
        if (dist <= this.contactRadius) return 0
        return clamp(dist / this.searchRadius, 0, 1)
    }

    @lock()
    async onUpdate() {
        super.onUpdate();
        logger.debug("Following nearest player...")
        await FollowSkill.followNearestPlayer(this.contactRadius, true)
        logger.debug("Followed nearest player.")
    }
}