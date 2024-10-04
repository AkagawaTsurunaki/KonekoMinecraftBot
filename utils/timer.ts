import {log} from "./log";

export class Timer {

    private time = 0
    private interval = 0

    constructor(interval: number = 20) {
        this.interval = interval
    }

    onPhysicsTick() {
        this.time += 1
        console.log(this.time)
    }

    check(): boolean {
        return this.time % this.interval == 0
    }
}