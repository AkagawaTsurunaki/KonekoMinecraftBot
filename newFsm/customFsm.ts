import {IdleState} from "./states/idleState";
import {AttackHostilesState} from "./states/attackHostilesState";
import {AutoFiniteStateMachine} from "./fsm";
import {AttackPlayerState} from "./states/attackPlayerState";

export class CustomFsm extends AutoFiniteStateMachine {

    private idleState: IdleState | null = null
    private attackHostilesState: AttackHostilesState | null = null
    private attackPlayerState: AttackPlayerState | null = null

    init() {
        this.idleState = new IdleState()
        this.attackHostilesState = new AttackHostilesState()
        this.attackPlayerState = new AttackPlayerState();

        this.allStates.push(this.idleState)
        this.allStates.push(this.attackHostilesState)
        this.allStates.push(this.attackPlayerState)

        this.idleState.nextStates = [this.attackHostilesState, this.attackPlayerState]
        this.attackHostilesState.nextStates = [this.idleState]
        this.attackPlayerState.nextStates = [this.idleState, this.attackHostilesState]

        this.currentState = this.idleState
    }

    reset() {
        this.currentState = this.idleState
    }
}