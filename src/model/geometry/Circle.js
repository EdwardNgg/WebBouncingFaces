import Vector from '../../lib/wgpu-math/Vector';

/**
 * The Circle class represents a two-dimensional circle with a center location,
 * radius, and color. The circle holds the necessary buffers and triangle-strip
 * vertices for rendering.
 */
class Circle {
  /** @prop {number} vertexArrayStride - The number of bytes per vertex. */
  static vertexArrayStride = 2 * Float32Array.BYTES_PER_ELEMENT;

  /**
   * Creates a new circle with a specific center, radius, and color. Buffers
   * are not initialized.
   *
   * @param {number} centerX - The horizontal pixel position of the center of
   *    the circle.
   * @param {number} centerY - The vertical pixel position of the center of the
   *    circle.
   * @param {number} radius - The pixel radius of the circle.
   * @param {Color} color - The color of the circle.
   * @constructor
   */
  constructor(centerX, centerY, radius, color) {
    /**
     * @prop {Vector} center - The center location of the circle in pixels
     *    relative to the DOM.
     */
    this.center = new Vector(2, [centerX, centerY]);
    /**
     * @prop {number} radius - The distance from the center to the edge of the
     * circle in pixels.
     */
    this.radius = radius;
    /** @prop {Color} color - The RGBA color of the circle. */
    this.color = color;

    // Create and initialize a circle properties uniform buffer.
    /**
     * @prop {Float32Array} props - The float array values containing the
     *    center and radius of the circle.
     */
    this.props = new Float32Array([
      ...this.center.data,
      this.radius,
    ]);
    /**
     * @prop {GPUBuffer} propsBuffer - The uniform buffer for the center and
     *    radius of the circle. */
    this.propsBuffer = undefined;

    /**
     * The circle vertex attributes holds a list of attributes for the divisions
     * on the circle. For each division, there are 2 points to form a triangle
     * strip. For each point, there is only a position attribute. For each
     * attribute, there are two elements:
     * (x, y).
     */
    /**
     * @prop {number} numDivisions - The number of discrete points to be
     *    rendered for the circle.
     */
    this.numDivisions = 128;
    const pointsPerDivision = 2;
    const elementsPerPoint = 2;

    /**
     * @prop {Float32Array} vertices - The float array containing a
     *    triangle-strip list of vertex attributes consisting of locations and
     *    colors.
     */
    this.vertices = new Float32Array(elementsPerPoint * pointsPerDivision
      * this.numDivisions);

    /**
     * @prop {GPUBuffer} verticesBuffer - The GPU Buffer holding a
     *    triangle-strip list of circle vertex locations and colors.
    */
    this.verticesBuffer = undefined;

    /**
     * @prop {GPUBindGroup} computeBindGroup - The GPU Bind Group for computing
     *    that includes the props and vertices buffers.
     */
    this.computeBindGroup = undefined;
  }
}

export default Circle;
