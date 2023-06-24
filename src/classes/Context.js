import Color from './Color';

/**
 * The singleton Context holds the global elements to render an HTML canvas
 * through WebGPU. It also contains methods that initialize the canvas for
 * WebGPU and control the rendering and compute passes.
 */
class Context {
  static #instance;

  static #isInternalConstructing = false;

  static moonstone = new Color('#5C9EAD');

  /**
   * Creates the single context instance by setting the necessary WebGPU
   * elements and initializing the application's canvas.
   *
   * @param {GPUAdapter} adapter - The interface for a system's implementation
   *  of WebGPU.
   * @param {HTMLCanvasElement} canvas - The HTML canvas that needs
   *  initialization and control for rendering.
   * @param {GPUDevice} device - The interface for the logical GPU device
   *  associated with the adapter.
   * @throws {TypeError} - Indicates non-private access of the constructor.
   * @private
   * @@constructor
   */
  constructor(adapter, canvas, device) {
    if (!Context.#isInternalConstructing) {
      throw new TypeError('[TYPE ERROR]: Context is not constructable.');
    }
    Context.#isInternalConstructing = false;
    this.adapter = adapter;
    this.canvas = canvas;
    this.device = device;

    // Configure the canvas and attach a resize event listener.
    this.resizeCanvas();
    this.resizeTimeout = 0;
    window.addEventListener('resize', this.handleResize.bind(this));

    // Configure the canvas context.
    this.context = this.canvas.getContext('webgpu');
    this.context.configure({
      device: this.device,
      format: navigator.gpu.getPreferredCanvasFormat(),
      alphamode: 'premultiplied',
    });
  }

  /**
   * Gets a single instance of the Context class and initializes the elements
   * for WebGPU.
   *
   * @param {HTMLCanvasElement} canvas - The HTML canvas that needs
   *  initialization and control for rendering.
   * @returns {Context} - The single instance of the Context class.
   * @throws {Error} - Indicates that WebGPU cannot be initialized.
   */
  static async getInstance(canvas) {
    if (Context.instance === undefined) {
      Context.#isInternalConstructing = true;

      // Initialize WebGPU adapter and device.
      if (!navigator.gpu) {
        throw new Error('[INIT ERROR]: The browser does not support WebGPU.');
      }
      const adapter = await navigator.gpu.requestAdapter();
      if (!adapter) {
        throw new Error('[INIT ERROR]: Could not request WebGPU adapter.');
      }
      const device = await adapter.requestDevice();

      Context.#instance = new Context(adapter, canvas, device);
    }
    return Context.#instance;
  }

  /**
   * Renders a single frame of the canvas and submits render and compute passes
   * to the GPU device queue.
   * @param {DOMHighResTimeStamp} timeStamp - The current time.
   */
  frame(timeStamp) {
    if (this.startTime === undefined) {
      this.startTime = timeStamp;
    }

    const commandEncoder = this.device.createCommandEncoder();
    const textureView = this.context.getCurrentTexture().createView();

    const renderPassDescriptor = {
      colorAttachments: [
        {
          clearValue: Context.moonstone.rgba,
          loadOp: 'clear',
          storeOp: 'store',
          view: textureView,
        },
      ],
    };

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.end();

    this.device.queue.submit([commandEncoder.finish()]);
    window.requestAnimationFrame(this.frame.bind(this));
  }

  /**
   * Renders the entire application to the canvas.
   */
  render() {
    window.requestAnimationFrame(this.frame.bind(this));
  }

  /**
   * Handles resizing the canvas when the browser window is resized.
   */
  handleResize() {
    this.resizeCanvas();
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    this.resizeTimeout = setTimeout(() => {
      this.resizeTimeout = 0;
    }, 250);
  }

  /**
 * Sets the canvas to the width and height of the window.
 */
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
}

export default Context;
