import {log} from "../utils/log";

export abstract class State {
    public name: string
    public nextStates: Array<State>

    abstract cond()

    abstract takeAction()

}

export abstract class AbstractState {

    public name: string
    public nextStates: Array<AbstractState>

    public constructor(name: string) {
        this.name = name
        this.nextStates = []
    }

    public abstract onUpdate(...args: any[])

    /**
     * 返回一个 0~1 的浮点数用以表示有多大置信度进入此状态。
     */
    public abstract getCondVal(): number

    /**
     * 当进入此状态时执行的操作。
     */
    public abstract onEntered()

    /**
     * 当退出此状态时执行的操作。
     */
    public abstract onExited()

}

export abstract class FSM {
    constructor() {
        this.register()
    }

    public curState: AbstractState
    private switchThr: number = 0.1

    protected abstract register()

    public switch(to: AbstractState) {
        if (this.curState.name !== to.name) {
            this.curState.onExited()
        }
        this.curState = to
        this.curState.onEntered()
    }

    public update() {
        log(`当前状态：${this.curState.name}`, true)
        try {
            let maxCondVal = this.switchThr
            let maxCondValState = null
            if (this.curState.getCondVal() > this.switchThr) {
                this.curState.onEntered()
            } else {
                for (let nextState of this.curState.nextStates) {
                    log(`邻接状态：${nextState.name}（${nextState.getCondVal()}）`, true);
                    if (nextState.getCondVal() > maxCondVal) {
                        maxCondValState = nextState
                    }
                }
                if (maxCondValState) {
                    this.switch(maxCondValState)
                }
            }


            // if (this.curState.cond()) {
            //     this.curState.takeAction()
            // } else {
            //     for (let nextState of this.curState.nextStates) {
            //         if (nextState.cond()) {
            //             this.curState = nextState
            //         }
            //     }
            // }
        } catch (e) {
            // 如果出现 TypeError: curState.nextStates is not iterable，请检查您的状态机环路是否存在 null 节点。
            throw e
        }
    }
}

