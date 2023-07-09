/**
 * The Controller class handles the input and controls tbe time logic of the
 * application. It makes any necessary changes to the model and view of the
 * application.
 */
class Controller {
  constructor(context) {
    /**
     * @prop {Context} context - The global elements shared across the
     *    application.
     */
    this.context = context;

    /** @prop {Model} model - The structure holding the application's data. */
    this.model = undefined;
    /** @prop {View} view - The rendered canvas of the application. */
    this.view = undefined;

    /**
     * @prop {DOMHighResTimeStamp} startTime - The DOM time when the application
     *    is first rendered.
     */
    this.startTime = 0;
    /**
     * @prop {DOMHighResTimeStamp} currentTime - The DOM time when the next
     *    application frame is rendered.
     */
    this.currentTime = 0;

    /**
     * @prop {number} resizeTimeout - The timeout ID associated with the
     *    callback handler for detecting when the browser window is actively
     *    being resized. The ID is 0 when there is no browser resize that
     *    occurs.
     */
    this.resizeTimeout = 0;
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  /**
   * Updates and tracks the time of the application.
   *
   * @param {DOMHighResTimeStamp} timeStamp - The current time the application
   *    frame is rendered.
   */
  updateTime(timeStamp) {
    if (!this.startTime) {
      this.startTime = timeStamp;
    }
    this.currentTime = timeStamp;
  }

  /**
   * Handles resizing the canvas when the browser window changes. When the
   * window is resized, pauses the view and resizes the canvas.
   */
  handleResize() {
    this.view.isPaused = true;
    this.view.resizeCanvas();

    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }

    this.resizeTimeout = setTimeout(() => {
      this.resizeTimeout = 0;
      this.view.isPaused = false;
    }, 250);
  }
}

export default Controller;
