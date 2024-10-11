import {IdleState} from "./states/idleState";
import {AttackHostilesState} from "./states/attackHostilesState";
import {AutoFiniteStateMachine, State} from "./fsm";

export class CustomFsm extends AutoFiniteStateMachine {

    idleState: State | null = null
    attackHostilesState: State | null = null

    init() {
        this.idleState = new IdleState()
        this.attackHostilesState = new AttackHostilesState()

        this.idleState.nextStates = [this.attackHostilesState]
        this.attackHostilesState.nextStates = [this.idleState]

        this.currentState = this.idleState
    }

    reset() {
        this.currentState = this.idleState
    }
}