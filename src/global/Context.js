/* global GPUBufferUsage */
import Calc from '../util/Calc';
import Color from '../model/attributes/Color';

/**
 * The singleton Context holds the global elements to render an HTML canvas
 * through WebGPU. It also contains methods that initialize the canvas for
 * WebGPU and control the rendering and compute passes.
 */
class Context {
  static #instance;

  static #isInternalConstructing = false;

  /**
   * Creates the single context instance with global elements shared across the
   * application.
   *
   * @param {GPUAdapter} adapter - The interface for a system's implementation
   *  of WebGPU.
   * @param {GPUDevice} device - The interface for the logical GPU device
   *  associated with the adapter.
   * @throws {TypeError} - Indicates non-private access of the constructor.
   * @private
   * @hideconstructor
   */
  constructor(adapter, device) {
    if (!Context.#isInternalConstructing) {
      throw new TypeError('[TYPE ERROR]: Context is not constructable.');
    }

    Context.#isInternalConstructing = false;

    /**
     * @prop {GPUAdapter} adapter - The interface for a system's implementation
     *    of WebGPU.
     */
    this.adapter = adapter;

    /**
     * @prop {GPUDevice} device - The interface for the logical GPU device
     *    associated with the adapter.
     */
    this.device = device;

    /**
     * @prop {Object.<string, Color>} colors - A list of colors for rendering
     *    faces.
     */
    this.colors = {
      antiFlashWhite: new Color('#EEEEEE'),
      moonstone: new Color('#5C9EAD'),
      paynesGray: new Color('#326273'),
      vanilla: new Color('#F5EE9E'),
    };
    this.initColorBuffers();

    /**
     * @prop {number} scale - The global ratio of device pixels to one logical
     *    pixel.
     */
    this.scale = window.devicePixelRatio || 1;
  }

  /**
   * Gets a single instance of the Context class and initializes the elements
   * for WebGPU.
   *
   * @returns {Context} - The single instance of the Context class.
   * @throws {Error} - Indicates that WebGPU cannot be initialized.
   */
  static async getInstance() {
    if (Context.#instance === undefined) {
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

      Context.#instance = new Context(adapter, device);
    }
    return Context.#instance;
  }

  /**
   * Initializes each color's uniform buffer for rendering.
   */
  initColorBuffers() {
    for (
      let i = 0, colors = Object.values(this.colors);
      i < colors.length;
      i += 1
    ) {
      colors[i].colorBuffer = this.device.createBuffer({
        size: Calc.roundUp(16, colors[i].data.byteLength),
        // eslint-disable-next-line no-bitwise
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });
      this.device.queue.writeBuffer(
        colors[i].colorBuffer,
        0,
        colors[i].data,
        0,
        colors[i].data.length,
      );
    }
  }
}

export default Context;
