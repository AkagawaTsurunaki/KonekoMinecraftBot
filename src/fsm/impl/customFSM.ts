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
import {FishingState} from "./state/fishingState";
import assert from "node:assert";
import {server} from "../../../index";

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
    private readonly fishingState: FishingState

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
        this.fishingState = new FishingState(this.bot)

        this.allStates = [this.idleState, this.attackHostilesState, this.attackPlayerState, this.diveState,
            this.followPlayerState, this.sleepState, this.harvestState, this.loggingState, this.inLavaState,
            this.onFireState, this.instructionState, this.fishingState,]
    }


    init() {
        this.idleState.nextStates = [this.attackHostilesState, this.attackPlayerState, this.diveState, this.followPlayerState, this.sleepState, this.harvestState, this.loggingState, this.inLavaState, this.onFireState, this.instructionState, this.fishingState]
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
        this.fishingState.nextStates = [this.idleState, this.attackHostilesState, this.diveState, this.followPlayerState, this.sleepState, this.inLavaState, this.onFireState, this.instructionState]

        this.currentState = this.idleState
    }

    reset() {
        this.currentState = this.idleState
    }

    start(): void {
        this.bot.events.on("secondTick", () => {
            this.update()
        })
        this.allStates.forEach(state => state.onListen())
    }

    update() {
        super.update();
        this.updateMermaid()
    }

    private updateMermaid() {
        const data = {
            type: "stateDiagram",
            data: {
                mermaid: this.getStateDiagramMermaid()
            }
        }
        server.pushMessage(data)
    }

    private getStateDiagramMermaid() {
        return "stateDiagram\n" +
            "classDef activateState fill:#dd4c39,color:white,font-weight:bold,stroke-width:2px,stroke:#a80000\n" +
            "classDef nextState fill:#945fd7,color:white,font-weight:bold,stroke-width:2px,stroke:#a80000\n" +
            "classDef deactivateState fill:#f3f4f5,color:gray,stroke:gray" + "\n" +
            this.defineStatesStyle() + "\n" +
            this.getStateConnection() + "\n" + this.getStatesActivateStyle()
    }

    private defineStatesStyle(): string {
        let mermaid = ""
        this.allStates.forEach(state => {
            const transVal = this.statesTransitionValueMap.get(state.id);
            mermaid += `state "${state.id}` + "<br>" + `${transVal}" as ${state.id}` + "\n"
        })
        return mermaid
    }

    public getStateConnection(): string {
        let lines = this.allStates.flatMap(state =>
            state.nextStates.map(nextState => `${state.id} --> ${nextState.id}`)
        );
        lines = Array.from(new Set(lines));
        let mermaid = ""
        lines.forEach(line => mermaid += line + "\n")
        return mermaid
    }

    private getStatesActivateStyle(): string {
        const statesStyleMap = new Map<string, string>()
        this.allStates.forEach(state => {
            statesStyleMap.set(state.id, "deactivateState")
        })
        const currentState = this.currentState
        assert(currentState, `"currentState" should not be null.`)
        statesStyleMap.set(currentState.id, "activateState")
        currentState.nextStates.forEach(state => {
            statesStyleMap.set(state.id, "nextState")
        })
        let mermaid = ""
        statesStyleMap.forEach((style, stateId) => {
            mermaid += `${stateId}:::${style}` + "\n"
        })
        return mermaid
    }
}