import {Vec3} from "vec3";
import {ExtendedBot} from "../extension/extendedBot";
import {AbstractAlgorithm} from "./abstractAlgorithm";

export class DbscanAlgorithm extends AbstractAlgorithm {
    constructor(bot: ExtendedBot) {
        super(bot)
    }

    private getNeighbors(points: Vec3[], index: number, eps: number): number[] {
        const neighbors: number[] = [];
        for (let i = 0; i < points.length; i++) {
            if (points[index].distanceTo(points[i]) <= eps) {
                neighbors.push(i);
            }
        }
        return neighbors;
    }

    private expandCluster(points: Vec3[], neighbors: number[], eps: number, minPts: number, visited: boolean[]): number[] {
        const cluster: number[] = [];
        for (const neighbor of neighbors) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                const newNeighbors = this.getNeighbors(points, neighbor, eps);
                if (newNeighbors.length >= minPts) {
                    neighbors.push(...newNeighbors);
                }
            }
            if (!cluster.includes(neighbor)) {
                cluster.push(neighbor);
            }
        }
        return cluster;
    }

    /**
     * 返回聚类列表。
     * 格式为：类编号，样本点列表（编号）
     *
     * @param points
     * @param eps
     * @param minPts
     */
    public dbscan(points: Vec3[], eps: number, minPts: number): number[][] {
        const clusters: number[][] = []
        const visited: boolean[] = new Array(points.length).fill(false);

        for (let i = 0; i < points.length; i++) {
            if (!visited[i]) {
                const neighbors = this.getNeighbors(points, i, eps);
                if (neighbors.length < minPts) {
                    visited[i] = true;
                } else {
                    const cluster = this.expandCluster(points, neighbors, eps, minPts, visited);
                    clusters.push(cluster);
                }
            }
        }

        return clusters
    }

}


