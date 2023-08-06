import Vector from './Vector';

class Matrix {
  /**
   * Creates a new null matrix or an initialized matrix as a grouped sequence
   * of 2, 3, or 4 floating point vectors.
   *
   * @param {number} c - The number of columns for the matrix
   * @param {number} r - The number of rows for the matrix.
   * @param {number[]} [data] - The array of initial values in column-major.
   * @throws {TypeError} Indicates that the number of columns or number of rows
   *    is either less than 2 or more than 4, or indicates that the initial data
   *    does not match the size of the matrix.
   */
  constructor(c, r, data) {
    if (!Number.isInteger(c) || !Number.isInteger(r) || c < 2 || c > 4 || r < 2
        || r > 4) {
      throw new TypeError(
        `[MAT ERR]: Cannot create a ${c}x${r} matrix. The matrix must `
          + 'be a grouped sequence of 2, 3, or 4 floating point vectors.',
      );
    }
    if (Array.isArray(data) && data.length !== c * r) {
      throw new TypeError(
        `[MAT ERR]: Cannot initialize a ${c}x${r} matrix with a `
          + `${data.length} data array. The size of the data must match the `
          + 'size of the matrix.',
      );
    }

    /** @prop {number} columns - The number of columns in the matrix. */
    this.columns = c;
    /** @prop {number} rows - The number of rows in the matrix. */
    this.rows = r;
    /**
     * @prop {bool} isSquare - Indicates that the number of rows and columns
     *    are the same
     */
    this.isSquare = this.columns === this.rows;
    /**
     * @prop {Float32Array} data - The float value data of the matrix in
     *    column-major order. The size of the data array matches the
     *    specifications for WebGPU and WGSL.
     */
    this.data = new Float32Array(this.columns * this.rows);
    if (this.rows === 3 && Array.isArray(data)) {
      switch (this.columns) {
        case 2:
          this.data = new Float32Array([
            ...data.slice(0, 3), 0,
            ...data.slice(3, 6), 0,
          ]);
          break;
        case 3:
          this.data = new Float32Array([
            ...data.slice(0, 3), 0,
            ...data.slice(3, 6), 0,
            ...data.slice(6, 9), 0,
          ]);
          break;
        default: // (case 4:)
          this.data = new Float32Array([
            ...data.slice(0, 3), 0,
            ...data.slice(3, 6), 0,
            ...data.slice(6, 9), 0,
            ...data.slice(9, 12), 0,
          ]);
      }
    } else if (this.rows === 3) {
      this.data = new Float32Array(this.columns * 4);
    } else if (Array.isArray(data)) {
      this.data = new Float32Array(data);
    }
  }

  /**
   * Creates an identity matrix.
   *
   * @throws {TypeError} Indicates that the matrix is non-square.
   */
  identity() {
    // If the matrix is non-square
    if (!this.isSquare) {
      throw new TypeError(
        `[MAT ERR]: Cannot create a ${this.columns}x${this.rows} identity `
          + 'matrix. Identity matrices must be square.',
      );
    }

    switch (this.columns) {
      case 2:
        this.data = new Float32Array([1, 0, 0, 1]);
        break;
      case 3:
        this.data = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0]);
        break;
      default: // (case 4:)
        this.data = new Float32Array(
          [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        );
    }
  }

  /**
   * Applies a translation to the 3x3 or 4x4 matrix.
   *
   * @prop {number[]} translateVector - The vector containing the translation
   *    factors to apply to the matrix.
   */
  translate(translateVector) {
    if (!this.isSquare) {
      throw new TypeError(
        `[MAT ERR]: Cannot create a ${this.columns}x${this.rows} translation `
          + 'matrix. The matrix must be 3x3 or 4x4.',
      );
    }
    const translateMatrix = Matrix.translation(this.columns, translateVector);
    this.data = Matrix.multiply(translateMatrix, this).data;
  }

  /**
   * Gets a column vector based on a zero-based index from the matrix.
   *
   * @param {number} index - The zero-based index of the column
   * @returns {Vector} The column vector corresponding to the index.
   * @throws {TypeError} Indicates that the desired index is out of bounds.
   */
  column(index) {
    if (!Number.isInteger(index) || index < 0 || index >= this.columns) {
      throw new TypeError(
        `[MAT ERR]: Cannot get column ${index} from a `
          + `${this.columns}x${this.rows} matrix. Column index must be between `
          + `0 and ${this.columns - 1}, inclusive.`,
      );
    }

    const stride = this.rows === 3 ? 4 : this.rows;
    return new Vector(
      this.rows,
      [...this.data.slice(index * stride, index * stride + this.rows)],
    );
  }

  /**
   * Gets a row vector based on a zero-based from the matrix.
   *
   * @param {number} index - The zero-based index of the row.
   * @returns {Vector} The row vector corresponding to the index.
   * @throws {TypeError} Indicates that the desired index is out of bounds.
   */
  row(index) {
    if (!Number.isInteger(index) || index < 0 || index >= this.rows) {
      throw new TypeError(
        `[MAT ERR]: Cannot get row ${index} from a `
          + `${this.columns}x${this.rows} matrix. Row index must be between `
          + `0 and ${this.rows - 1}, inclusive.`,
      );
    }
    const row = [];
    const stride = this.rows === 3 ? 4 : this.rows;
    for (let i = 0; i < this.columns; i += 1) {
      row.push(this.data[index + stride * i]);
    }
    return new Vector(this.columns, row);
  }

  /**
   * Multiplies two matrices a and b. Returns c as follows:
   *    c = a x b
   *
   * @param {Matrix} a - The first matrix.
   * @param {Matrix} b - The second matrix
   * @returns {Matrix} The resultant matrix c.
   * @throws {TypeError} Indicates that the parameters are not matrices or the
   *    the sizes of the matrix cannot be multiplied.
   */
  static multiply(a, b) {
    if (!(a instanceof Matrix) || !(b instanceof Matrix)) {
      throw new TypeError(
        '{MAT ERR]: Cannot multiply matrices. Multiplication must be between '
          + 'matrices.',
      );
    }
    if (a.columns !== b.rows) {
      throw new TypeError(
        `[MAT ERR]: Cannot multiply a ${a.columns}x${a.rows} matrix by a `
          + `${b.columns}x${b.rows} matrix. The number of columns of the first `
          + 'matrix must match the number of rows in the second matrix.',
      );
    }

    const c = [];
    for (let i = 0; i < b.columns; i += 1) {
      for (let j = 0; j < a.rows; j += 1) {
        c.push(Vector.dot(a.row(j), b.column(i)));
      }
    }
    return new Matrix(b.columns, a.rows, c);
  }

  /**
   * Creates a translation matrix for graphics geometric transformations.
   *
   * @param {number} n - The size of the square translation matrix.
   * @param {number[]} translateVector - The amount to translate.
   * @returns {Matrix} The translation matrix.
   * @throws {TypeError} Indicates that the matrix is non-square or the size of
   *    the translation vector conflicts with the matrix.
   */
  static translation(n, translateVector) {
    // Checks if n is a valid number between 2 - 4, and creates a matrix.
    const matrix = new Matrix(n, n);

    // Checks if the translation is 3x3 or 4x4.
    if (n === 2) {
      throw new TypeError(
        '[MAT ERR]: Cannot create a 2x2 translation matrix. '
          + 'Translation matrices must be 3x3 or 4x4.',
      );
    }

    // Checks the size of the vector is compatible.
    if (translateVector.length !== n - 1) {
      throw new TypeError(
        `[MAT ERR]: Cannot translate a ${n}x${n} matrix with a `
          + `${translateVector.length} vector. Vector must be of size `
          + `${n - 1}.`,
      );
    }

    matrix.identity();

    const offset = n === 3 ? 8 : 12;
    for (let i = 0; i < translateVector.length; i += 1) {
      matrix.data[offset + i] = translateVector[i];
    }
    return matrix;
  }
}

export default Matrix;
