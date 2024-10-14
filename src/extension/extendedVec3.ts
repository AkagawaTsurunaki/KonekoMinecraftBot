import {Vec3} from "vec3";

/**
 * Extended Vec3 add some methods to convert a Vec3 instance to a string (not string[] or number[]) for indexing.
 */
export class ExtendedVec3 extends Vec3 {

    public toCommaSplitString() {
        return `${this.x},${this.y},${this.z}`
    }

    public static fromCommaSplitString(str: string): Vec3 | ExtendedVec3 {
        const posSplits = str.split(",")
        const x = Number(posSplits[0])
        const y = Number(posSplits[1])
        const z = Number(posSplits[2])
        return this.of(new Vec3(x, y, z))
    }

    /**
     * Do not use constructor, instead, use `ExtendedVec3.of(vec3: Vec3)`.
     * @param vec3
     * @private
     */
    private constructor(vec3: Vec3) {
        super(vec3.x, vec3.y, vec3.z);
    }

    public static of(vec3: Vec3) {
        return new ExtendedVec3(vec3)
    }
}