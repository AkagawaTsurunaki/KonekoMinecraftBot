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

