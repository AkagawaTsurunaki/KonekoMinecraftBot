export class LimitedArray<T> {
    private array: T[] = [];
    private readonly maxLen: number

    constructor(maxLen: number, ...items: T[]) {
        for (const item of items) {
            this.add(item);
        }
        this.maxLen = maxLen
    }

    add(item: T): void {
        if (this.array.length >= this.maxLen) {
            this.array.shift()
        }
        this.array.push(item);
    }

    clear() {
        this.array = []
    }

    getArray(): T[] {
        return this.array;
    }
}