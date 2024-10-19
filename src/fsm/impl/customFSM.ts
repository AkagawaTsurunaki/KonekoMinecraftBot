import {IdleState} from "./state/idleState";
import {AttackHostilesState} from "./state/attackHostilesState";
import {AttackPlayerState} from "./state/attackPlayerState";
import {DiveState} from "./state/diveState";
import {FollowPlayerState} from "./state/followPlayerState";
import {SleepState} from "./state/sleepState";
import {HarvestState} from "./state/harvestState";
import {LoggingState} from "./state/loggingState";
import {FSMImpl} from "./fsmImpl";
import {InLavaState} from "./state/inLavaState";
import {OnFireState} from "./state/onFireState";
import {InstructionState} from "./state/instructionState";
import {ExtendedBot} from "../../extension/extendedBot";

export class CustomFSM extends FSMImpl {

    protected bot: ExtendedBot

    private readonly idleState: IdleState;
    private readonly attackHostilesState: AttackHostilesState;
    private readonly attackPlayerState: AttackPlayerState;
    private readonly diveState: DiveState;
    private readonly followPlayerState: FollowPlayerState;
    private readonly sleepState: SleepState;
    private readonly harvestState: HarvestState;
    private readonly loggingState: LoggingState;
    private readonly inLavaState: InLavaState;
    private readonly onFireState: OnFireState;
    private readonly instructionState: InstructionState;


    constructor(bot: ExtendedBot) {
        super();
        this.bot = bot

        this.idleState = new IdleState(this.bot)
        this.attackHostilesState = new AttackHostilesState(this.bot)
        this.attackPlayerState = new AttackPlayerState(this.bot);
        this.diveState = new DiveState(this.bot);
        this.followPlayerState = new FollowPlayerState(this.bot)
        this.sleepState = new SleepState(this.bot)
        this.harvestState = new HarvestState(this.bot)
        this.loggingState = new LoggingState(this.bot)
        this.inLavaState = new InLavaState(this.bot)
        this.onFireState = new OnFireState(this.bot)
        this.instructionState = new InstructionState(this.bot)
    }


    init() {
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
        this.allStates.push(this.instructionState)

        this.idleState.nextStates = [this.attackHostilesState, this.attackPlayerState, this.diveState, this.followPlayerState, this.sleepState, this.harvestState, this.loggingState, this.inLavaState, this.onFireState, this.instructionState]
        this.attackHostilesState.nextStates = [this.idleState, this.followPlayerState, this.instructionState]
        this.attackPlayerState.nextStates = [this.idleState, this.attackHostilesState, this.instructionState]
        this.diveState.nextStates = [this.idleState, this.followPlayerState, this.instructionState]
        this.followPlayerState.nextStates = [this.idleState, this.diveState, this.attackHostilesState, this.instructionState]
        this.sleepState.nextStates = [this.idleState, this.instructionState]
        this.harvestState.nextStates = [this.idleState, this.attackPlayerState, this.attackPlayerState, this.instructionState]
        this.loggingState.nextStates = [this.idleState, this.instructionState]
        this.inLavaState.nextStates = [this.idleState, this.onFireState, this.instructionState]
        this.onFireState.nextStates = [this.idleState, this.instructionState]
        this.instructionState.nextStates = [this.idleState]

        this.currentState = this.idleState
    }

    reset() {
        this.currentState = this.idleState
    }
}