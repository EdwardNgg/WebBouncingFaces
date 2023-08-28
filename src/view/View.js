/* global GPUBufferUsage GPUShaderStage GPUTextureUsage */

import Circle from '../model/geometry/Circle';

import fragWGSL from '../shaders/frag.wgsl';
import vertWGSL from '../shaders/vert.wgsl';
import Calc from '../util/Calc';

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

    // Initialize and set up the canvas and its uniform buffer.
    /**
     * @prop {HTMLCanvasElement} canvas - The element receiving the output of
     *    the WebGPU render passes.
     */
    this.canvas = canvas;
    /**
     * @prop {Float32Array} canvasData - The float data array storing the canvas
     *    width and height.
     */
    this.canvasData = new Float32Array(2);
    /**
     * @prop {GPUBuffer} canvasBuffer - The GPU buffer storing the canvas width
     *    and height.
     */
    this.canvasBuffer = this.context.device.createBuffer({
      size: Calc.roundUp(16, this.canvasData.byteLength),
      // eslint-disable-next-line no-bitwise
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    this.resizeCanvas();

    // Configure the canvas context for rendering.
    /**
     * @prop {string} format - The optimal format for displaying content on the
     *    system.
     */
    this.format = navigator.gpu.getPreferredCanvasFormat();
    /**
     * @prop {GPUCanvasContext} canvasContext - The WebGPU rendering context for
     *    the canvas.
     */
    this.canvasContext = this.canvas.getContext('webgpu');
    this.canvasContext.configure({
      device: this.context.device,
      format: this.format,
      alphamode: 'premultiplied',
    });

    // Initialize the texture for multisample anti-aliasing.
    /**
     * @prop {number} sampleCount - The number of samples to take for every
     *    pixel.
     */
    this.sampleCount = 4;
    /**
     * @prop {GPUTexture} multiSampleTexture - The texture storage to hold
     *    images for multisample anti-aliasing.
     */
    this.multiSampleTexture = undefined;
    this.updateMultiSampleTexture();

    /**
     * @prop {Face[]} faces - A list of faces that can be rendered to the
     *    canvas.
     */
    this.faces = [];

    // Initialize shader modules for rendering.
    /**
     * @prop {GPUShaderModule} vertexShader - The shader code for normalizing
     *    the vertex data for each circle.
     */
    this.vertexShader = this.context.device.createShaderModule({
      code: vertWGSL,
    });

    /**
     * @prop {GPUShaderModule} fragmentShader - The shader code for coloring
     *    each circle.
     */
    this.fragmentShader = this.context.device.createShaderModule({
      code: fragWGSL,
    });

    /**
     * @prop {GPUBindGroupLayout} renderBindGroupLayout - The layout of the
     *    buffer bindings for all render passes.
     */
    this.renderBindGroupLayout = this.context.device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          buffer: {
            type: 'uniform',
          },
        },
        {
          binding: 1,
          visibility: GPUShaderStage.VERTEX,
          buffer: {
            type: 'uniform',
          },
        },
        {
          binding: 2,
          visibility: GPUShaderStage.FRAGMENT,
          buffer: {
            type: 'uniform',
          },
        },
      ],
    });

    /**
     * @prop {GPURenderPipeline} renderPipeline - The pipeline for the vertex
     *    and fragment stages for rendering circles.
     */
    this.renderPipeline = this.context.device.createRenderPipeline({
      vertex: {
        module: this.vertexShader,
        entryPoint: 'main',
        buffers: [
          {
            arrayStride: Circle.vertexArrayStride,
            stepMode: 'vertex',
            attributes: [
              {
                shaderLocation: 0,
                offset: 0,
                format: 'float32x2',
              },
            ],
          },
        ],
      },
      fragment: {
        module: this.fragmentShader,
        entryPoint: 'main',
        targets: [
          {
            format: this.format,
          },
        ],
      },
      primitive: {
        topology: 'triangle-strip',
      },
      layout: this.context.device.createPipelineLayout({
        bindGroupLayouts: [this.renderBindGroupLayout],
      }),
      multisample: {
        count: this.sampleCount,
      },
    });
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

    const renderPassEncoder = commandEncoder.beginRenderPass({
      colorAttachments: [
        {
          clearValue: this.context.colors.moonstone.rgba,
          loadOp: 'clear',
          storeOp: 'store',
          view: this.multiSampleTexture.createView(),
          resolveTarget: this.canvasContext.getCurrentTexture().createView(),
        },
      ],
    });
    renderPassEncoder.setPipeline(this.renderPipeline);

    this.faces.forEach((face) => {
      for (
        let circles = face.getCircles(), circle = circles.next();
        !circle.done;
        circle = circles.next()
      ) {
        renderPassEncoder.setBindGroup(0, circle.value.renderBindGroup);
        renderPassEncoder.setVertexBuffer(0, circle.value.verticesBuffer);
        renderPassEncoder.draw(circle.value.vertices.byteLength / Circle.vertexArrayStride);
      }
    });

    renderPassEncoder.end();
    this.context.device.queue.submit([commandEncoder.finish()]);
    this.render();
  }

  /**
   * Sets the canvas to the width and height of the window.
   */
  resizeCanvas() {
    this.canvas.width = this.canvas.clientWidth * this.context.scale;
    this.canvas.height = this.canvas.clientHeight * this.context.scale;

    this.canvasData[0] = this.canvas.width;
    this.canvasData[1] = this.canvas.height;

    this.context.device.queue.writeBuffer(
      this.canvasBuffer,
      0,
      this.canvasData,
      0,
      this.canvasData.length,
    );
  }

  /**
   * Destroys the current multisample texture and creates a new texture with the
   * updated canvas width and height.
   */
  updateMultiSampleTexture() {
    if (this.multiSampleTexture) {
      this.multiSampleTexture.destroy();
    }
    this.multiSampleTexture = this.context.device.createTexture({
      size: this.canvasData,
      sampleCount: this.sampleCount,
      format: this.format,
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
      dimension: '2d',
    });
  }

  /**
   * Starts rendering the application by requesting animation frames from the
   * browser.
   */
  render() {
    window.requestAnimationFrame(this.frame.bind(this));
  }

  /**
   * Initializes the bind groups for render a face and begins rendering the new
   * face.
   *
   * @param {Face} face - The new face with initialized vertices to render.
   */
  renderFace(face) {
    face.setTransformBuffer(this.context.device.createBuffer({
      size: face.transform.data.byteLength,
      // eslint-disable-next-line no-bitwise
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    }));
    this.context.device.queue.writeBuffer(
      face.transformBuffer,
      0,
      face.transform.data,
      0,
      face.transform.data.length,
    );

    for (
      let circles = face.getCircles(), circle = circles.next();
      !circle.done;
      circle = circles.next()
    ) {
      circle.value.renderBindGroup = this.context.device.createBindGroup({
        layout: this.renderBindGroupLayout,
        entries: [
          { binding: 0, resource: { buffer: this.canvasBuffer } },
          { binding: 1, resource: { buffer: face.transformBuffer } },
          { binding: 2, resource: { buffer: circle.value.color.colorBuffer } },
        ],
      });
    }

    this.faces.push(face);
  }
}

export default View;
