import {Vec3} from "vec3";
import {bot} from "../index";

function getCenterPoint3D(vectors: Vec3[]): Vec3 {
    if (vectors.length == 0) {
        throw new Error("不能为空列表")
    }
    let sumX = 0;
    let sumY = 0;
    let sumZ = 0;

    // 遍历数组，累加每个Vec3的x, y, z值
    for (const vector of vectors) {
        sumX += vector.x;
        sumY += vector.y;
        sumZ += vector.z;
    }

    // 计算平均值
    return new Vec3(sumX / vectors.length, sumY / vectors.length, sumZ / vectors.length)
}

export function getVec3ListFromClusters(clusters: number[][], origin: Vec3[]): Vec3[][] {
    let elementsLen = 0;
    clusters.forEach(arr => elementsLen += arr.length)
    if (elementsLen !== origin.length) {
        throw new Error(`${elementsLen} !== ${origin.length} 应具有相同长度`)
    }
    return clusters.map(ids => ids.map(id => origin[id]));
}

export function getCenterPointSortedClusters(clusters: Vec3[][]): Vec3[][] {
    if (clusters == null || clusters.length == 0) return

    const pointsInfo = clusters.map(points => {
        return {
            centerPoint: getCenterPoint3D(points),
            points: points
        }
    });
    pointsInfo.sort((pA, pB) => {
        const curPos = bot.entity.position
        return curPos.distanceTo(pB.centerPoint) - curPos.distanceTo(pA.centerPoint);
    })
    return pointsInfo.map(info => info.points)
}