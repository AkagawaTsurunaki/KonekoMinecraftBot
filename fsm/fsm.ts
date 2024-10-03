export abstract class AbstractState {

    public name: string
    public nextStates: Array<AbstractState>
    protected isEntered: boolean = false

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

    protected abstract register()

    public abstract update()
}

