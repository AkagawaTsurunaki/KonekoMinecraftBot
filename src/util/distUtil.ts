import {Vec3} from "vec3";
import {max, min} from "./math";

export function minDistanceAmong(positions: Vec3[], center: Vec3) {
    const distances = positions.map(pos => pos.distanceTo(center));
    return min(distances)
}

export function maxDistanceAmong(positions: Vec3[], center: Vec3) {
    const distances = positions.map(pos => pos.distanceTo(center));
    return max(distances)
}
