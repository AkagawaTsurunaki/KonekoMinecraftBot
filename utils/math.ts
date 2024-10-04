export function createLinearFunction(x1: number, y1: number, x2: number, y2: number): (x: number) => number {
    const m = (y2 - y1) / (x2 - x1);
    const b = y1 - m * x1;
    return (x: number): number => m * x + b;
}

export function dot(vec1: Array<number>, vec2: Array<number>) {
    let sum = 0
    if (vec1.length != vec2.length) {
        throw TypeError(`vec1 与 vec2 应具有相同的长度，但是现在 ${vec1.length} != ${vec2.length}`)
    }
    for (let i = 0; i < vec1.length; i++) {
        sum += vec1[i] * vec2[i]
    }
    return sum
}

export function clamp(val: number, min: number, max: number): number {
    if (val < min) {
        return min
    } else if (val > max) {
        return max
    } else {
        return val
    }
}

export function createLevelFuncByMap(map: Map<number, number>): (x: number) => number {
    const xs = new Array<number>
    const ys = new Array<number>
    map.forEach((value, key) => {
        xs.push(key)
        ys.push(value)
    })
    return createLevelFuncByArray(xs, ys)
}

export function createLevelFuncByArray(xs: Array<number>, ys: Array<number>): (x: number) => number {
    const n = xs.length
    console.assert(xs.length === ys.length)
    return (x: number) => {
        for (let i = 0; i < n - 1; i++) {
            if (xs[i] <= x && x < xs[i + 1]) {
                return ys[i]
            }
        }
        // 如果 x 超出了定义域则抛出异常
        console.error(`x=${x} 不在定义域内`)
        throw new Error(`x=${x} 不在定义域内`)
    }
}

export function getTimeDiff(date1: Date, date2: Date) {
    return Math.abs((date2.getTime() - date1.getTime()) / 1000);
}

export function randomNeg1ToPos1() {
    return (Math.random() - 0.5) * 2
}