import {log} from "../utils/log";
import {IdleState} from "./idleState";
import {FollowPlayerState} from "./followPlayerState";

export abstract class State {
    public env: any
    public name: string
    public nextStates: Array<State>

    abstract cond()
    abstract updateEnv(env: any)
    abstract takeAction()

}

export abstract class FSM {
    constructor() {
        this.register()
    }
    public curState: State

    protected abstract register()
    public abstract update()
}

export class KonekoFsm extends FSM {
    public update() {
        try {
            if (this.curState.cond()) {
                this.curState.takeAction()
            } else {
                for (let nextState of this.curState.nextStates) {
                    this.curState = nextState
                }
            }
        } catch (e) {
            // 如果出现 TypeError: curState.nextStates is not iterable，请检查您的状态机环路是否存在 null 节点。
            throw e
        }

        log(`FSM 当前：${this.curState.name}`)
    }

    protected register() {
        // 状态机注册
        const idleState = new IdleState()
        const followState = new FollowPlayerState()
        idleState.nextStates = [followState]
        followState.nextStates = [idleState]
        this.curState = idleState
    }

}