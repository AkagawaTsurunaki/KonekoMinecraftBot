export class ExtendedMap<K, V extends number> extends Map<K, V> {
    setAndAdd(key: K, value: V) {
        if (this.has(key)) {
            const val = this.get(key);
            if (val) {
                // @ts-ignore
                this.set(key, value + val)
            }
        } else {
            this.set(key, value)
        }
    }

    toKeyList() {
        const result: K[] = []
        this.forEach((value, key) => {
            result.push(key)
        })
        return result;
    }
}

export class AutoClearZeroValueMap<K, V extends number> extends ExtendedMap<K, V> {

    set(key: K, value: V): this {
        const result = super.set(key, value);
        this.clearZeros()
        return result;
    }

    get(key: K): V | undefined {
        const result = super.get(key)
        this.clearZeros()
        return result
    }

    forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any) {
        this.clearZeros()
        super.forEach(callbackfn, thisArg)
    }

    has(key: K): boolean {
        const result = super.has(key);
        this.clearZeros()
        return result;
    }

    delete(key: K): boolean {
        const result = super.delete(key)
        this.clearZeros()
        return result;
    }

    clearZeros() {
        super.forEach((value, key) => {
            if (value === 0) {
                this.delete(key)
            }
        })
    }
}