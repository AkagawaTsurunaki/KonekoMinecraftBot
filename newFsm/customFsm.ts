import {IdleState} from "./states/idleState";
import {AttackHostilesState} from "./states/attackHostilesState";
import {AutoFiniteStateMachine} from "./fsm";
import {AttackPlayerState} from "./states/attackPlayerState";
import {DiveState} from "./states/diveState";
import {FollowPlayerState} from "./states/followPlayerState";
import {SleepState} from "./states/sleepState";

export class CustomFsm extends AutoFiniteStateMachine {

    private idleState: IdleState | null = null
    private attackHostilesState: AttackHostilesState | null = null
    private attackPlayerState: AttackPlayerState | null = null
    private diveState: DiveState | null = null;
    private followPlayerState: FollowPlayerState | null = null;
    private sleepState: SleepState | null = null;

    init() {
        this.idleState = new IdleState()
        this.attackHostilesState = new AttackHostilesState()
        this.attackPlayerState = new AttackPlayerState();
        this.diveState = new DiveState();
        this.followPlayerState = new FollowPlayerState()
        this.sleepState = new SleepState()

        this.allStates.push(this.idleState)
        this.allStates.push(this.attackHostilesState)
        this.allStates.push(this.attackPlayerState)
        this.allStates.push(this.diveState)
        this.allStates.push(this.followPlayerState)
        this.allStates.push(this.sleepState)

        this.idleState.nextStates = [this.attackHostilesState, this.attackPlayerState, this.diveState, this.followPlayerState, this.sleepState]
        this.attackHostilesState.nextStates = [this.idleState]
        this.attackPlayerState.nextStates = [this.idleState, this.attackHostilesState]
        this.diveState.nextStates = [this.idleState, this.followPlayerState]
        this.followPlayerState.nextStates = [this.idleState, this.diveState, this.attackHostilesState]
        this.sleepState.nextStates = [this.idleState]

        this.currentState = this.idleState
    }

    reset() {
        this.currentState = this.idleState
    }
}