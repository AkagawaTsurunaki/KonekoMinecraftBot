/**
 * Exponential decay function.
 * @Reference https://blog.csdn.net/zhufenghao/article/details/80879260
 * @param t Current time.
 * @param steps The domain of the function.
 * @param start The beginning value of the function.
 * @param end The end value of the function.
 */
export function expDelay(t: number, steps: number, start: number = 1, end: number = 0) {
    const alpha = Math.log(start / end) / steps
    const l = Math.log(start) / alpha
    return Math.exp(-alpha * (t + l))
}