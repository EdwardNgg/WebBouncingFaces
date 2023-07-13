import Circle from './Circle';

/**
 * The Semicircle class represents half of a circle with a center location,
 * radius, and color starting from a specified angle. The semicircle can be
 * rendered when its buffers are initialized.
 * @class
 * @extends Circle
 */
class SemiCircle extends Circle {
  /**
   * Creates an instance of a semicircle with a specific center location,
   * radius, color, and starting angle.
   *
   * @param {number} centerX - The horizontal pixel position of the center of
   *    the circle.
   * @param {number} centerY - The vertical pixel position of the center of the
   *    circle.
   * @param {number} radius - The pixel radius of the circle.
   * @param {Color} color - The color of the circle.
   * @param {number} angle - The angle at which the semicircle starts
   *    counterclockwise.
   * @constructor
   */
  constructor(centerX, centerY, radius, color, angle) {
    super(centerX, centerY, radius, color);
    /**
     * @prop {number} angle - The angle at which the semicircle starts in
     *    degrees. The end of the semicircle is at angle + 180˚.
     */
    this.angle = angle;

    /**
     * @prop {Float32Array} props - The float array values containing the
     *    center, color, radius, and angle of the semicircle.
     */
    this.props = new Float32Array([
      ...this.center.data,
      this.radius,
      this.angle,
    ]);
  }
}

export default SemiCircle;
