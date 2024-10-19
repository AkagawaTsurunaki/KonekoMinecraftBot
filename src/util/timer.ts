export class Timer {

    private _time = 0
    private readonly interval: number;

    constructor(interval: number = 20) {
        this.interval = interval
    }

    onPhysicsTick() {
        this._time += 1
    }

    check(): boolean {
        return this._time % this.interval == 0
    }

    reset() {
        this._time = 0
    }

    get time() {
        return this._time
    }
}