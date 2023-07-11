import Circle from './geometry/Circle';
import SemiCircle from './geometry/SemiCircle';

class Face {
  constructor(centerX, centerY, radius, velocityX, velocityY, color, eyeMouthColor) {
    this.head = new Circle(centerX, centerY, radius, color);

    this.velocity = {
      x: velocityX,
      y: velocityY,
    };

    this.eyes = {
      left: new Circle(
        this.head.center.x - (3 / 8) * this.head.radius,
        this.head.center.y,
        this.head.radius / 8,
        eyeMouthColor,
      ),
      right: new Circle(
        this.head.center.x + (3 / 8) * this.head.radius,
        this.head.center.y,
        this.head.radius / 8,
        eyeMouthColor,
      ),
    };

    this.mouth = new SemiCircle(
      this.head.center.x,
      this.head.center.y,
      this.head.radius / 4,
      eyeMouthColor,
      180,
    );
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
}

export default Face;
