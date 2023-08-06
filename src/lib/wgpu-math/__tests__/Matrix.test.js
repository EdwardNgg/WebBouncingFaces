import Matrix from '../Matrix';

describe('Creating Matrices', () => {
  test('Creating a 3x2 null matrix.', () => {
    const matrix = new Matrix(3, 2);
    expect(matrix).toBeTruthy();
    expect(matrix.columns).toBe(3);
    expect(matrix.rows).toBe(2);
    expect(matrix.isSquare).toBeFalsy();
    expect(matrix.data).toEqual(new Float32Array([0, 0, 0, 0, 0, 0]));
  });

  test('Creating a 4x4 null matrix.', () => {
    const matrix = new Matrix(4, 4);
    expect(matrix).toBeTruthy();
    expect(matrix.columns).toBe(4);
    expect(matrix.rows).toBe(4);
    expect(matrix.isSquare).toBeTruthy();
    expect(matrix.data).toEqual(
      new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
    );
  });

  test('Creating a 3x3 filled matrix.', () => {
    const matrix = new Matrix(3, 3, [3, 5, 8, 2, 4, 8, 4, 0, 2]);
    expect(matrix).toBeTruthy();
    expect(matrix.columns).toBe(3);
    expect(matrix.rows).toBe(3);
    expect(matrix.isSquare).toBeTruthy();
    expect(matrix.data).toEqual(new Float32Array(
      [3, 5, 8, 0, 2, 4, 8, 0, 4, 0, 2, 0],
    ));
  });

  test('Creating a 4x3 filled matrix.', () => {
    const matrix = new Matrix(4, 3, [9, 5, 4, 0, 3, 3, 6, 7, 5, 7, 4, 6]);
    expect(matrix).toBeTruthy();
    expect(matrix.columns).toBe(4);
    expect(matrix.rows).toBe(3);
    expect(matrix.isSquare).toBeFalsy();
    expect(matrix.data).toEqual(new Float32Array(
      [9, 5, 4, 0, 0, 3, 3, 0, 6, 7, 5, 0, 7, 4, 6, 0],
    ));
  });

  test('Creating an invalid matrix with conflicting size and data.', () => {
    expect(() => new Matrix(4, 2, [0])).toThrow();
  });

  test('Creating an invalid matrix with floating sizes.', () => {
    expect(() => new Matrix(2.6, 3.6, [7, 6])).toThrow();
  });

  test('Creating an invalid matrix with five columns.', () => {
    expect(() => new Matrix(5, 8, [])).toThrow();
  });
});

describe('Creating Identity Matrices', () => {
  test('Creating a 2x2 identity matrix.', () => {
    const matrix = new Matrix(2, 2);
    matrix.identity();

    expect(matrix).toBeTruthy();
    expect(matrix.columns).toBe(2);
    expect(matrix.rows).toBe(2);
    expect(matrix.isSquare).toBeTruthy();
    expect(matrix.data).toEqual(new Float32Array([1, 0, 0, 1]));
  });

  test('Creating a 3x3 identity matrix.', () => {
    const matrix = new Matrix(3, 3);
    matrix.identity();

    expect(matrix).toBeTruthy();
    expect(matrix.columns).toBe(3);
    expect(matrix.rows).toBe(3);
    expect(matrix.isSquare).toBeTruthy();
    expect(matrix.data).toEqual(new Float32Array(
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
    ));
  });

  test('Creating a 4x4 identity matrix.', () => {
    const matrix = new Matrix(4, 4);
    matrix.identity();

    expect(matrix).toBeTruthy();
    expect(matrix.columns).toBe(4);
    expect(matrix.rows).toBe(4);
    expect(matrix.isSquare).toBeTruthy();
    expect(matrix.data).toEqual(new Float32Array(
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    ));
  });

  test('Creating an invalid identity matrix from a non-square matrix.', () => {
    expect(() => (new Matrix(2, 3)).identity()).toThrow();
  });
});

describe('Accessing Matrices', () => {
  test('Accessing a row (01).', () => {
    const matrix = new Matrix(4, 3, [0, 7, 3, 7, 1, 3, 5, 5, 5, 1, 2, 8]);
    const row = matrix.row(0);
    expect(row.size).toBe(4);
    expect(row.data).toEqual(new Float32Array([0, 7, 5, 1]));
  });

  test('Accessing a row (02).', () => {
    const matrix = new Matrix(4, 3, [0, 7, 3, 7, 1, 3, 5, 5, 5, 1, 2, 8]);
    const row = matrix.row(1);
    expect(row.size).toBe(4);
    expect(row.data).toEqual(new Float32Array([7, 1, 5, 2]));
  });

  test('Accessing a row (03).', () => {
    const matrix = new Matrix(4, 3, [0, 7, 3, 7, 1, 3, 5, 5, 5, 1, 2, 8]);
    const row = matrix.row(2);
    expect(row.size).toBe(4);
    expect(row.data).toEqual(new Float32Array([3, 3, 5, 8]));
  });

  test('Accessing an invalid row.', () => {
    expect(() => {
      const matrix = new Matrix(4, 3, [0, 7, 3, 7, 1, 3, 5, 5, 5, 1, 2, 8]);
      return matrix.row(3);
    }).toThrow();
  });

  test('Accessing a column (01).', () => {
    const matrix = new Matrix(4, 3, [0, 7, 3, 7, 1, 3, 5, 5, 5, 1, 2, 8]);
    const column = matrix.column(0);
    expect(column.size).toBe(3);
    expect(column.data).toEqual(new Float32Array([0, 7, 3, 0]));
  });

  test('Accessing a column (02).', () => {
    const matrix = new Matrix(4, 3, [0, 7, 3, 7, 1, 3, 5, 5, 5, 1, 2, 8]);
    const column = matrix.column(1);
    expect(column.size).toBe(3);
    expect(column.data).toEqual(new Float32Array([7, 1, 3, 0]));
  });

  test('Accessing a column (03).', () => {
    const matrix = new Matrix(4, 3, [0, 7, 3, 7, 1, 3, 5, 5, 5, 1, 2, 8]);
    const column = matrix.column(2);
    expect(column.size).toBe(3);
    expect(column.data).toEqual(new Float32Array([5, 5, 5, 0]));
  });

  test('Accessing a column (04).', () => {
    const matrix = new Matrix(4, 3, [0, 7, 3, 7, 1, 3, 5, 5, 5, 1, 2, 8]);
    const column = matrix.column(3);
    expect(column.size).toBe(3);
    expect(column.data).toEqual(new Float32Array([1, 2, 8, 0]));
  });

  test('Accessing an invalid column.', () => {
    expect(() => {
      const matrix = new Matrix(4, 3, [0, 7, 3, 7, 1, 3, 5, 5, 5, 1, 2, 8]);
      return matrix.column(4);
    }).toThrow();
  });
});

describe('Multiplying Matrices', () => {
  test('Multiplying two matrices (01).', () => {
    const a = new Matrix(2, 2, [1, -1, 0, 5]);
    const b = new Matrix(3, 2, [1, 4, 0, 5, 2, 4]);
    const c = Matrix.multiply(a, b);

    expect(c).toBeTruthy();
    expect(c.columns).toBe(3);
    expect(c.rows).toBe(2);
    expect(c.isSquare).toBeFalsy();
    expect(c.data).toEqual(new Float32Array([1, 19, 0, 25, 2, 18]));
  });

  test('Multiplying two matrices (02).', () => {
    const a = new Matrix(2, 3, [5, -2, 4, 3, 1, 1]);
    const b = new Matrix(2, 2, [-2, 5, -1, 0]);
    const c = Matrix.multiply(a, b);

    expect(c).toBeTruthy();
    expect(c.columns).toBe(2);
    expect(c.rows).toBe(3);
    expect(c.isSquare).toBeFalsy();
    expect(c.data).toEqual(new Float32Array([5, 9, -3, 0, -5, 2, -4, 0]));
  });

  test('Multiplying two matrices (03).', () => {
    const a = new Matrix(3, 2, [1, 1, 4, 2, 2, 2]);
    const b = new Matrix(2, 3, [1, 2, 2, 3, 3, -2]);
    const c = Matrix.multiply(a, b);

    expect(c).toBeTruthy();
    expect(c.columns).toBe(2);
    expect(c.rows).toBe(2);
    expect(c.isSquare).toBeTruthy();
    expect(c.data).toEqual(new Float32Array([13, 9, 11, 5]));
  });
});

describe('Translating Matrices', () => {
  test('Creating a new 3x3 translation matrix.', () => {
    const matrix = Matrix.translation(3, [5, 6]);
    expect(matrix).toBeTruthy();
    expect(matrix.columns).toBe(3);
    expect(matrix.rows).toBe(3);
    expect(matrix.isSquare).toBeTruthy();
    expect(matrix.data).toEqual(new Float32Array(
      [1, 0, 0, 0, 0, 1, 0, 0, 5, 6, 1, 0],
    ));
  });

  test('Creating a new 4x4 translation matrix.', () => {
    const matrix = Matrix.translation(4, [3, 7, 9]);
    expect(matrix).toBeTruthy();
    expect(matrix.columns).toBe(4);
    expect(matrix.rows).toBe(4);
    expect(matrix.isSquare).toBeTruthy();
    expect(matrix.data).toEqual(new Float32Array(
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 3, 7, 9, 1],
    ));
  });

  test('Creating an invalid 2x2 translation matrix.', () => {
    expect(() => Matrix.translation(2, [1])).toThrow();
  });

  test('Creating a translation matrix with an invalid vector.', () => {
    expect(() => Matrix.translation(3, [5, 6, 7])).toThrow();
  });

  test('Translating a preexisting 3x3 matrix.', () => {
    const matrix = new Matrix(3, 3);
    matrix.identity();
    matrix.translate([-6, 8]);
    expect(matrix).toBeTruthy();
    expect(matrix.columns).toBe(3);
    expect(matrix.rows).toBe(3);
    expect(matrix.isSquare).toBeTruthy();
    expect(matrix.data).toEqual(new Float32Array(
      [1, 0, 0, 0, 0, 1, 0, 0, -6, 8, 1, 0],
    ));
  });

  test('Translating a preexisting 4x4 matrix.', () => {
    const matrix = new Matrix(4, 4);
    matrix.identity();
    matrix.translate([9, 4, 7]);
    expect(matrix).toBeTruthy();
    expect(matrix.columns).toBe(4);
    expect(matrix.rows).toBe(4);
    expect(matrix.isSquare).toBeTruthy();
    expect(matrix.data).toEqual(new Float32Array(
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 9, 4, 7, 1],
    ));
  });

  test('Translating a preexisting matrix multiple times.', () => {
    const matrix = new Matrix(3, 3);
    matrix.identity();
    matrix.translate([5, 3]);
    matrix.translate([0, 8]);
    matrix.translate([-1, -4]);
    expect(matrix).toBeTruthy();
    expect(matrix.columns).toBe(3);
    expect(matrix.rows).toBe(3);
    expect(matrix.isSquare).toBeTruthy();
    expect(matrix.data).toEqual(new Float32Array(
      [1, 0, 0, 0, 0, 1, 0, 0, 4, 7, 1, 0],
    ));
  });

  test('Translating an invalid non-square matrix.', () => {
    expect(() => {
      const matrix = new Matrix(4, 3);
      matrix.translate([3, 4, 3]);
    }).toThrow();
  });
});
