import {IdleState} from "./states/idleState";
import {AttackHostilesState} from "./states/attackHostilesState";
import {AttackPlayerState} from "./states/attackPlayerState";
import {DiveState} from "./states/diveState";
import {FollowPlayerState} from "./states/followPlayerState";
import {SleepState} from "./states/sleepState";
import {HarvestState} from "./states/harvestState";
import {LoggingState} from "./states/loggingState";
import {FSMImpl} from "./fsmImpl";
import {InLavaState} from "./states/inLavaState";
import {OnFireState} from "./states/onFireState";

export class CustomFSM extends FSMImpl {

    private idleState: IdleState | null = null
    private attackHostilesState: AttackHostilesState | null = null
    private attackPlayerState: AttackPlayerState | null = null
    private diveState: DiveState | null = null;
    private followPlayerState: FollowPlayerState | null = null;
    private sleepState: SleepState | null = null;
    private harvestState: HarvestState | null = null;
    private loggingState: LoggingState | null = null;
    private inLavaState: InLavaState | null = null;
    private onFireState: OnFireState | null = null;

    init() {
        this.idleState = new IdleState()
        this.attackHostilesState = new AttackHostilesState()
        this.attackPlayerState = new AttackPlayerState();
        this.diveState = new DiveState();
        this.followPlayerState = new FollowPlayerState()
        this.sleepState = new SleepState()
        this.harvestState = new HarvestState()
        this.loggingState = new LoggingState()
        this.inLavaState = new InLavaState()
        this.onFireState = new OnFireState()

        this.allStates.push(this.idleState)
        this.allStates.push(this.attackHostilesState)
        this.allStates.push(this.attackPlayerState)
        this.allStates.push(this.diveState)
        this.allStates.push(this.followPlayerState)
        this.allStates.push(this.sleepState)
        this.allStates.push(this.harvestState)
        this.allStates.push(this.loggingState)
        this.allStates.push(this.inLavaState)
        this.allStates.push(this.onFireState)

        this.idleState.nextStates = [this.attackHostilesState, this.attackPlayerState, this.diveState, this.followPlayerState, this.sleepState, this.harvestState, this.loggingState, this.inLavaState, this.onFireState]
        this.attackHostilesState.nextStates = [this.idleState, this.followPlayerState]
        this.attackPlayerState.nextStates = [this.idleState, this.attackHostilesState]
        this.diveState.nextStates = [this.idleState, this.followPlayerState]
        this.followPlayerState.nextStates = [this.idleState, this.diveState, this.attackHostilesState]
        this.sleepState.nextStates = [this.idleState]
        this.harvestState.nextStates = [this.idleState, this.attackPlayerState, this.attackPlayerState]
        this.loggingState.nextStates = [this.idleState]
        this.inLavaState.nextStates = [this.idleState, this.onFireState]
        this.onFireState.nextStates = [this.idleState]

        this.currentState = this.idleState
    }

    reset() {
        this.currentState = this.idleState
    }
}