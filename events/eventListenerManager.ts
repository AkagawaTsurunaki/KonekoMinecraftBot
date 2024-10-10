import {BotEvents} from "mineflayer";
import {bot} from "../index";

/**
 * 事件监听器管理器
 */
export abstract class EventListenersManager {
    private eventListeners: [keyof BotEvents, BotEvents[keyof BotEvents]][]

    constructor() {
        this.eventListeners = []
    }

    // 当State中的onUpdate方法被调用后，Transition 中的事件监听器才被注册并自动更新参数。
    /**
     * 向 EventListenersManager 注册一个事件监听器。
     *
     * @param event 事件。
     * @param listener 监听器。
     * @protected
     */
    protected addEventListener<E extends keyof BotEvents>(event: E, listener: BotEvents[E]): void {
        this.eventListeners.push([event, listener])
        bot.on(event, listener)
    }

    /**
     * 向 EventListenersManager 注册所有的事件监听器。
     * 注意：必须实现此抽象方法。
     */
    public abstract registerEventListeners(): void

    /**
     * 移除所有被 EventListenersManager 所注册的事件监听器。
     */
    public removeEventListeners(): void {
        this.eventListeners.forEach(([event, listener]) => {
            bot.removeListener(event, listener)
        })
        this.eventListeners = []
    }
}

/**
 * 以下是一个例子
 *
 * export class ExampleEventListenerManager extends EventListenersManager {
 *     registerEventListeners(): void {
 *         this.addEventListener("chat", (username, message, translate) => {
 *             if (username === masterName && message === "Hello") {
 *                 bot.chat("Hello")
 *             }
 *         })
 *     }
 * }
 *
 * const exampleEventListenerManager = new ExampleEventListenerManager()
 *
 * bot.on("spawn", () => {
 *     exampleEventListenerManager.registerEventListeners()
 * });
 *
 * bot.on("chat", async (username, message, translate, jsonMsg) => {
 *     if (username === masterName && message === "remove") {
 *         exampleEventListenerManager.removeEventListeners()
 *     }
 * })
 *
 *
 */
