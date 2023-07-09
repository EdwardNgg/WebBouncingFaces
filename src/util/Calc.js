/**
 * The Calc class is a static utility class for calculations.
 */
class Calc {
  /**
   * Rounds a positive integer number n up to the nearest positive integer
   * multiple of k.
   *
   * @param {number} n - The positive integer multiple.
   * @param {number} k - The positive integer number.
   * @returns {number} The next multiple of k after n
   * @throws {TypeError} - Indicates that either n or k is not a positive
   *    integer.
   */
  static roundUp(n, k) {
    if (n <= 0 || k <= 0 || !Number.isInteger(n) || !Number.isInteger(k)) {
      throw TypeError('[TYPE ERR]: Can only round upwards for positive '
        + 'integers.');
    }
    return Math.ceil(n / k) * k;
  }
}

export default Calc;
