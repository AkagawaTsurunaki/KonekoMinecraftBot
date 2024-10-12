import {Vec3} from "vec3";
import {getLogger} from "../utils/logger";
import {logDuration} from "../common/decorators/logDuration";


const logger = getLogger("FloodFillAlgorithm")

class FloodFillAlgorithm {
    @logDuration(logger)
    public static floodFill(blocks: Vec3[], startPos: Vec3) {
        if (blocks.includes(startPos)) {
            logger.debug(startPos)
        }
    }
}


const vecs = []

for (let i = 0; i < 10000; i++) {
    const vec3 = new Vec3(Math.random() * 1000, Math.random() * 1000, Math.random() * 1000);
    vecs.push(vec3)
}

FloodFillAlgorithm.floodFill(vecs, new Vec3(0, 0, 0))
