/**
 * The View class controls the rendering of faces to a specified canvas. It is
 * also responsible for passing changes in time to the controller for
 * appropriate updates.
 */
class View {
  constructor(context, canvas) {
    /**
     * @prop {Context} context - The global elements shared across the
     *    application.
     */
    this.context = context;

    /**
     * @prop {Controller} controller - The control for the application's input
     *    and time logic.
     */
    this.controller = undefined;

    // Initialize and set up the canvas.
    /**
     * @prop {HTMLCanvasElement} canvas - The element receiving the output of
     *    the WebGPU render passes.
     */
    this.canvas = canvas;
    this.resizeCanvas();
    this.canvasContext = this.canvas.getContext('webgpu');
    this.canvasContext.configure({
      device: this.context.device,
      format: navigator.gpu.getPreferredCanvasFormat(),
      alphamode: 'premultiplied',
    });

    /**
     * @prop {Face[]} faces - A list of faces that can be rendered to the
     *    canvas.
     */
    this.faces = [];
  }

  /**
   * Renders a single frame of the application by submitting render passes to
   * the GPU device.
   *
   * @param {DOMHighResTimeStamp} timeStamp - The current time in the DOM.
   */
  frame(timeStamp) {
    this.controller.updateTime(timeStamp);

    const commandEncoder = this.context.device.createCommandEncoder();
    const textureView = this.canvasContext.getCurrentTexture().createView();

    const renderPassDescriptor = {
      colorAttachments: [
        {
          clearValue: this.context.colors.moonstone.rgba,
          loadOp: 'clear',
          storeOp: 'store',
          view: textureView,
        },
      ],
    };

    const renderPassEncoder = commandEncoder.beginRenderPass(
      renderPassDescriptor,
    );
    renderPassEncoder.end();
    this.context.device.queue.submit([commandEncoder.finish()]);
    this.render();
  }

  /**
   * Sets the canvas to the width and height of the window.
   */
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  /**
   * Starts rendering the application by requesting animation frames from the
   * browser.
   */
  render() {
    window.requestAnimationFrame(this.frame.bind(this));
  }
}

export default View;
