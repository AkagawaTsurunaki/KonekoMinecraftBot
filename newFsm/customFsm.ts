import {IdleState} from "./states/idleState";
import {AttackHostilesState} from "./states/attackHostilesState";
import {AutoFiniteStateMachine} from "./fsm";

export class CustomFsm extends AutoFiniteStateMachine {

    private idleState: IdleState | null = null
    private attackHostilesState: AttackHostilesState | null = null

    init() {
        this.idleState = new IdleState()
        this.attackHostilesState = new AttackHostilesState()

        this.allStates.push(this.idleState)
        this.allStates.push(this.attackHostilesState)

        this.idleState.nextStates = [this.attackHostilesState]
        this.attackHostilesState.nextStates = [this.idleState]

        this.currentState = this.idleState
    }

    reset() {
        this.currentState = this.idleState
    }
}