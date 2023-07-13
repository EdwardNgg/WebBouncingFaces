/**
 * The Calc class is a static utility class for calculations.
 */
class Calc {
  /**
   * Rounds a positive integer number n up to the nearest positive integer
   * multiple of k.
   *
   * @param {number} k - The positive integer multiple.
   * @param {number} n - The positive integer number.
   * @returns {number} The next multiple of k after n
   * @throws {TypeError} - Indicates that either k or n is not a positive
   *    integer.
   */
  static roundUp(k, n) {
    if (k <= 0 || n <= 0 || !Number.isInteger(k) || !Number.isInteger(n)) {
      throw TypeError('[TYPE ERR]: Can only round upwards for positive '
        + 'integers.');
    }
    return Math.ceil(n / k) * k;
  }
}

export default Calc;
