/**
 * The Color class converts a hex code and alpha value to standard percent RGB
 * values
 */
class Color {
  /**
   * Creates an instance of standard RGB percent color values based on a hex
   * code string.
   *
   * @param {string} hex - The color hex code in RGB format.
   * @param {number} alpha - The opacity of the color between 0.0 and 1.0,
   *    inclusive.
   * @throws {TypeError} Indicates that the hex code is not well-formatted or
   *    the alpha value is not between 0.0 and 1.0, inclusive.
   * @constructor
   */
  constructor(hex, alpha = 1) {
    if (!/#?([0-9A-Fa-f]){6}/.test(hex)) {
      throw new TypeError('[TYPE ERROR]: Expected a valid hex color code.');
    }
    if (alpha < 0 || alpha > 1) {
      throw new TypeError('[TYPE ERROR]: Expected a valid alpha value '
        + 'between 0.0 and 1.0.');
    }

    /**  @prop {string} hex - The hex value of the RGBA color. */
    this.hex = hex.charAt(0) === '#'
      ? hex.toUpperCase()
      : `#${hex.toUpperCase()}`;
    /**
     * @prop {Object} rgba - A container for the individual RGBA percent
     *    values of the color.
     * @prop {number} rgba.r - The red percent value of the color.
     * @prop {number} rgba.g - The green percent value of the color.
     * @prop {number} rgba.b - The blue percent value of the color.
     * @prop {number} rgba.a - The opacity/alpha value of the color.
     */
    this.rgba = {
      r: parseInt(this.hex.substring(1, 3), 16) / 255,
      g: parseInt(this.hex.substring(3, 5), 16) / 255,
      b: parseInt(this.hex.substring(5, 7), 16) / 255,
      a: alpha,
    };
    /**
     * @prop {Float32Array} value - The float array values of the color in
     *    RGBA order.
     */
    this.value = new Float32Array([
      this.rgba.r, this.rgba.g, this.rgba.b, this.rgba.a,
    ]);
  }
}

export default Color;
