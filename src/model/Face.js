import Circle from './geometry/Circle';
import Matrix from '../lib/wgpu-math/Matrix';
import SemiCircle from './geometry/SemiCircle';

/**
 * The face class holds the face's position, radius, speed, colors, and
 * transformations. It also contains the buffers for translations and rotations.
 */
class Face {
  constructor(centerX, centerY, radius, velocityX, velocityY, color, eyeMouthColor) {
    /**
     * @prop {Circle} head - The circle representing the head of the face.
     */
    this.head = new Circle(centerX, centerY, radius, color);

    /**
     * @prop {Object} velocity - The speed of the face.
     * @prop {number} velocity.x - The horizontal speed of the face.
     * @prop {number} velocity.y - The vertical speed of the face.
     */
    this.velocity = {
      x: velocityX,
      y: velocityY,
    };

    /**
     * @prop {Object} eyes - The set of circles representing the eyes of the
     *    face.
     * @prop {Circle} eyes.left - The circle representing the left eye.
     * @prop {Circle} eyes.right - The circle representing the right eye.
     */
    this.eyes = {
      left: new Circle(
        this.head.center.x - (3 / 8) * this.head.radius,
        this.head.center.y + this.head.radius / 8,
        this.head.radius / 8,
        eyeMouthColor,
      ),
      right: new Circle(
        this.head.center.x + (3 / 8) * this.head.radius,
        this.head.center.y + this.head.radius / 8,
        this.head.radius / 8,
        eyeMouthColor,
      ),
    };

    /**
     * @prop {SemiCircle} mouth - The semi-circle representing the mouth of the
     *    face.
     */
    this.mouth = new SemiCircle(
      this.head.center.x,
      this.head.center.y,
      this.head.radius / 4,
      eyeMouthColor,
      180,
    );

    /**
     * @prop {Matrix} transform - The matrix representing translations and
     *    rotations.
     */
    this.transform = new Matrix(3, 3);
    this.transform.identity();

    /**
     * @prop {GPUBuffer} transformBuffer - The GPU buffer holding the
     *    transformation matrix for the face.
     */
    this.transformBuffer = undefined;

    /**
     * @prop {DOMHighResTimeStamp} timeCreated - The time relative to the DOM
     *    when the face was first created.
     */
    this.timeCreated = performance.now();

    /**
     * @prop {DOMHighResTimeStamp} timeModified - The time relative to the DOM
     *    when the face was last modified.
     */
    this.timeModified = this.timeCreated;
  }

  /**
   * Generates the circles and semicircles composing the face.
   *
   * @generator
   * @function getCircles
   * @yields {Circle} - The next circle or semicircle composing the face.
   */
  * getCircles() {
    yield this.head;
    yield this.eyes.left;
    yield this.eyes.right;
    yield this.mouth;
  }

  /**
   * Sets the transformation buffer to a new GPU buffer.
   *
   * @param {GPUBuffer} buffer - The new buffer to set the transform buffer to.
   */
  setTransformBuffer(buffer) {
    this.transformBuffer = buffer;
  }

  /**
   * Modifies the transformation matrix by adding a new translation based on
   * the change in time and the speed of the face.
   *
   * @param {DOMHighResTimeStamp} time - The current time relevant to the DOM.
   */
  translate(time) {
    const timeDelta = (time - this.timeModified) * 0.001;
    this.transform.translate([
      this.velocity.x * timeDelta,
      this.velocity.y * timeDelta,
    ]);
    this.timeModified = time;
  }
}

export default Face;
