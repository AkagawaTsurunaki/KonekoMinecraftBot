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
import {LoveState} from "./state/loveState";
import {SearchForChestState} from "./state/searchForChestState";
import {KillAnimalsState} from "./state/killAnimalsState";

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
    private readonly loveState: LoveState;
    private readonly searchForChestState: SearchForChestState;
    private readonly killAnimalsState: KillAnimalsState;

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
        this.loveState = new LoveState(this.bot)
        this.searchForChestState = new SearchForChestState(this.bot);
        this.killAnimalsState = new KillAnimalsState(this.bot)

        this.allStates = [this.idleState, this.attackHostilesState, this.attackPlayerState, this.diveState,
            this.followPlayerState, this.sleepState, this.harvestState, this.loggingState, this.inLavaState,
            this.onFireState, this.instructionState, this.fishingState, this.loveState, this.searchForChestState,
            this.killAnimalsState]
    }


    init() {
        this.idleState.nextStates = [this.attackHostilesState, this.attackPlayerState, this.diveState,
            this.followPlayerState, this.sleepState, this.harvestState, this.loggingState, this.inLavaState,
            this.onFireState, this.instructionState, this.fishingState, this.loveState, this.searchForChestState,
            this.killAnimalsState]
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
        this.loveState.nextStates = [this.idleState]
        this.searchForChestState.nextStates = [this.idleState]
        this.killAnimalsState.nextStates = [this.idleState]

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
        server.sendMessage(data)
    }

    private getStateDiagramMermaid() {
        const purple = {
            stroke: "#af7eec",
            fill: "#e2d0f8",
            color: "#7030a0"
        }
        const blue = {
            stroke: "#46b1e1",
            fill: "#c1e5f5",
            color: "#156285"
        }
        const gray = {
            stroke: "#7f7f7f",
            fill: "#d9d9d9",
            color: "#404040"
        }
        return "stateDiagram\n" +
            `classDef activateState fill:${purple.fill},color:${purple.color},stroke:${purple.stroke}\n` +
            `classDef nextState fill:${blue.fill},color:${blue.color},stroke:${blue.stroke}\n` +
            `classDef deactivateState fill:${gray.fill},color:${gray.color},stroke:${gray.stroke}` + "\n" +
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