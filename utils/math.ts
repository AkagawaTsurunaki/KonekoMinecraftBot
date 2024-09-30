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