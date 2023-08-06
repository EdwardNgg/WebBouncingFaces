/**
 * The Vector class creates grouped sequence of 2, 3, or 4 floating-point scalar
 * components. It can also perform calculations between two vectors.
 */
class Vector {
  /**
   * Creates a new null vector or an initialized floating point vector as a
   * grouped sequence of 2, 3, or 4 scalar components.
   *
   * @param {number} n - The size of the vector.
   * @param {number} [data] - The initial vector data of size n.
   * @throws {TypeError} Indicates that the size of the data and the size of the
   *    vector do not match, or indicates that the size is not 2, 3, or 4.
   * @constructor
   */
  constructor(n, data) {
    if (!Number.isInteger(n) || n < 2 || n > 4) {
      throw new TypeError(
        `[VEC ERR]: Cannot create a ${n} vector. Vectors must be grouped `
          + 'sequences of 2, 3, or 4 scalar components.',
      );
    }
    if (Array.isArray(data) && data.length !== n) {
      throw new TypeError(
        `[VEC ERR]: Cannot create a ${n} vector with a ${data.length} data '
          + 'array. The size of the data must match the size of the vector.`,
      );
    }
    /** @prop {number} size - The number of scalar components in the vector. */
    this.size = n;
    /**
     * @prop {Float32Array} data - The float array data of the vector in x,
     *    y, z, h order. The size of the data array matches the specifications
     *    for WebGPU and WGSL.
     */
    this.data = new Float32Array(this.size);
    if (this.size === 3 && Array.isArray(data)) {
      this.data = new Float32Array([...data, 0]);
    } else if (this.size === 3) {
      this.data = new Float32Array(4);
    } else if (Array.isArray(data)) {
      this.data = new Float32Array(data);
    }
  }

  /**
   * @prop {number} x - The first floating point scalar component of the vector.
   */
  get x() {
    return this.data[0];
  }

  set x(val) {
    this.data[0] = val;
  }

  /**
   * @prop {number} y - The second floating point scalar component of the
   *    vector.
   */
  get y() {
    return this.data[1];
  }

  set y(val) {
    this.data[1] = val;
  }

  /**
   * @prop {number} z - The third floating point scalar component of the vector.
   */
  get z() {
    if (this.size < 3) {
      throw new TypeError(
        `[VEC ERR] Cannot get the z-component of a ${this.size} vector. `
          + 'Vector must be of size 3 or 4.',
      );
    }
    return this.data[2];
  }

  set z(val) {
    if (this.size < 3) {
      throw new TypeError(
        `[VEC ERR] Cannot set the z-component of a ${this.size} vector. `
          + 'Vector must be of size 3 or 4.',
      );
    }
    this.data[2] = val;
  }

  /**
   * @prop {number} w - The fourth floating point scalar component of the
   *    vector.
   */
  get w() {
    if (this.size < 4) {
      throw new TypeError(
        `[VEC ERR]: Cannot get the w-component of a ${this.size} vector. `
          + 'Vector must be of size 4.',
      );
    }
    return this.data[3];
  }

  set w(val) {
    if (this.size < 4) {
      throw new TypeError(
        `[VEC ERR]: Cannot set the w-component of a ${this.size} vector. `
          + 'Vector must be of size 4.',
      );
    }
    this.data[3] = val;
  }

  /**
   * Computes the dot product between two vectors a and b. Returns c as follows:
   *    c = a · b
   *
   * @param {Vector} a - The first vector.
   * @param {Vector} b - The second vector.
   * @returns {number} The dot product.
   * @throws {TypeError} Indicates that the parameters are not vectors or the
   *    sizes of the vectors conflict with each other.
   */
  static dot(a, b) {
    if (!(a instanceof Vector) || !(b instanceof Vector)) {
      throw new TypeError(
        '{VEC ERR]: Cannot compute the dot product. Dot products must be '
          + 'between vectors.',
      );
    }
    if (a.size !== b.size) {
      throw new TypeError(
        `[VEC ERR]: Cannot compute the dot product between a ${a.size} vector `
          + `and a ${b.size} vector. Vectors must be the same size.`,
      );
    }
    let dotProduct = 0;
    for (let i = 0; i < a.size; i += 1) {
      dotProduct += a.data[i] * b.data[i];
    }
    return dotProduct;
  }
}

export default Vector;
