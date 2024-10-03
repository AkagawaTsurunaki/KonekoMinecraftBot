import {log} from "../utils/log";

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

    public update() {
        try {
            log(`当前状态：${this.curState.name}`, true)
            if (this.curState.cond()) {
                this.curState.takeAction()
            } else {
                for (let nextState of this.curState.nextStates) {
                    if (nextState.cond()) {
                        this.curState = nextState
                    }
                }
            }
        } catch (e) {
            // 如果出现 TypeError: curState.nextStates is not iterable，请检查您的状态机环路是否存在 null 节点。
            throw e
        }

        log(`FSM 当前：${this.curState.name}`)
    }
}

