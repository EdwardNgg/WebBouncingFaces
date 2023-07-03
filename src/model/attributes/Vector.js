/**
 * The Vector class represents a value with up to four elements.
 */
class Vector {
  /**
   * Creates up to a four-dimensional vector. Each value must be specified upon
   * creation.
   *
   * @param {number} x - The x-component of the value.
   * @param {number} [y] - The y-component of the value.
   * @param {number} [z] - The z-component of the value.
   * @param {number} [h] - The h-component of the value.
   * @constructor
   */
  constructor(x, y, z, h) {
    const values = [x];

    /** @prop {number} x  - The x-component of the vector. */
    this.x = x;
    /** @prop {number} size - The number of elements in the vector. */
    this.size = 1;

    if (y !== undefined) {
      this.size += 1;
      /** @prop {number} y - The y-component of the vector. */
      this.y = y;
      values.push(y);
    }

    if (z !== undefined) {
      this.size += 1;
      /** @prop {number} z - The z-component of the vector. */
      this.z = z;
      values.push(z);
    }

    if (h !== undefined) {
      this.size += 1;
      /** @prop {number} h - The h-component of the vector. */
      this.h = h;
      values.push(h);
    }

    /**
     * @prop {Float32Array} value - The float array values of the vector in x,
     *    y, z, h order. The number of elements matches the dimension/size of
     *    the vector.
     */
    this.value = new Float32Array(values);
  }
}

export default Vector;
