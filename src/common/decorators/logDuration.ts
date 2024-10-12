import {hrtime} from "node:process";
import pino from "pino";
import Logger = pino.Logger;


/**
 * 用于记录函数运行时间的装饰器。
 * @param logger 日志对象。
 * @param enable 是否启用计时，出于性能考虑。
 */
export function logDuration(logger: Logger, enable: boolean = true) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args: any[]) {
            const start = hrtime();
            const result = originalMethod.apply(this, args);
            if (enable) {
                if (result instanceof Promise) {
                    result.then(() => {
                        const [seconds, nanoseconds] = hrtime(start);
                        logger.debug(`Async function "${propertyKey}" took ${seconds * 1e3 + nanoseconds / 1e6} milliseconds.`);
                    }).catch(() => {
                        const [seconds, nanoseconds] = hrtime(start);
                        logger.debug(`Async function "${propertyKey}" took ${seconds * 1e3 + nanoseconds / 1e6} milliseconds.`);
                    });
                } else {
                    const [seconds, nanoseconds] = hrtime(start);
                    logger.debug(`Function "${propertyKey}" took ${seconds * 1e3 + nanoseconds / 1e6} milliseconds.`);
                }
            }

            return result;
        };
        return descriptor;
    };
}