/* global GPUBufferUsage GPUShaderStage */

import Calc from '../util/Calc';
import Face from './Face';
import SemiCircle from './geometry/SemiCircle';

import circleComputeWGSL from '../shaders/circle.compute.wgsl';
import semiCircleComputeWGSL from '../shaders/semiCircle.compute.wgsl';

/**
 * The Model holds the data structure holding faces for an instance of the
 * application. It is also responsible for performing WebGPU compute passes to
 * generate vertex triangle-strip lists for the face data.
 */
class Model {
  constructor(context) {
    /**
     * @prop {Context} context - The global shared context for the application.
     */
    this.context = context;

    /**
     * @prop {View} - The View responsible for rendering the current model of
     *    the application.
     */
    this.view = undefined;

    /**
     * @prop {Face[]} faces - The list of faces that are in the application.
     */
    this.faces = [];

    // Create and initialize compute shader modules.
    /**
     * @prop {GPUShaderModule} computeCircleShader - The shader code for
     *    computing the triangle-strip list of attributes to render a circle.
     */
    this.computeCircleShader = this.context.device.createShaderModule({
      code: circleComputeWGSL,
    });
    /**
     * @prop {GPUShaderModule} computeSemiCircleShader - The shader code for
     *    computing the triangle-strip list of attributes to render a
     *    semicircle.
     */
    this.computeSemiCircleShader = this.context.device.createShaderModule({
      code: semiCircleComputeWGSL,
    });

    // Create compute bind group layouts associated with the shader modules.
    /**
     * @prop {GPUBindGroupLayout} computeBindGroupLayout - The layout of buffer
     *    bindings for all compute passes.
     */
    this.computeBindGroupLayout = this.context.device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.COMPUTE,
          buffer: {
            type: 'uniform',
          },
        },
        {
          binding: 1,
          visibility: GPUShaderStage.COMPUTE,
          buffer: {
            type: 'storage',
          },
        },
      ],
    });

    // Create WebGPU compute pipelines.
    /**
     * @prop {Object.<string, number>} computeConstants - The override values
     *    available for the compute shader modules. Contains fixed values for
     *    computation.
     */
    this.computeConstants = {
      workGroupSize: 16,
    };
    /**
     * @prop {GPUComputePipeline} computeCirclePipeline - The pipeline for the
     *    compute shader stage for determining the triangle-strip list for
     *    circles.
     */
    this.computeCirclePipeline = this.context.device.createComputePipeline({
      compute: {
        entryPoint: 'main',
        module: this.computeCircleShader,
        constants: this.computeConstants,
      },
      layout: this.context.device.createPipelineLayout({
        bindGroupLayouts: [this.computeBindGroupLayout],
      }),
    });
    /**
     * @prop {GPUComputePipeline} computeSemiCirclePipeline - The pipeline for
     *    the compute shader stage for determining the triangle-strip list for
     *    semicircles.
     */
    this.computeSemiCirclePipeline = this.context.device.createComputePipeline({
      compute: {
        entryPoint: 'main',
        module: this.computeSemiCircleShader,
        constants: this.computeConstants,
      },
      layout: this.context.device.createPipelineLayout({
        bindGroupLayouts: [this.computeBindGroupLayout],
      }),
    });
  }

  /**
   * Creates a new face based on the specified center location, radius, and
   * velocity. Initializes all buffers for computing a triangle list of
   * vertices. Performs the computations, and sends the face to be rendered by
   * the view.
   *
   * @param {number} positionX - The center x-location of the face relative to
   *     relative to the client DOM.
   * @param {number} positionY - The center y-location of the face relative to
   *    the client DOM.
   * @param {number} [radius = 100] - The radius of the face.
   * @param {number} [velocityX = 10] - The speed of the face in the
   *    x-direction.
   * @param {number} [velocityY = 10] - The speed of the face in the
   *    y-direction.
   */
  createFace(positionX, positionY, radius = 100, velocityX = 10, velocityY = 10) {
    const face = new Face(
      positionX,
      positionY,
      radius,
      velocityX,
      velocityY,
      this.context.colors.vanilla,
      this.context.colors.paynesGray,
    );
    this.initFaceComputeBuffers(face);
    this.computeFaceVertices(face);
    this.faces.push(face);
    this.view.renderFace(face);
  }

  /**
   * Initializes all necessary compute buffers to calculate the triangle list of
   * vertices for each circle in the face.
   *
   * @param {Face} face - The face with uninitialized buffers.
   */
  initFaceComputeBuffers(face) {
    // Loop through all circles and semicircles composing the face.
    for (
      let circleIt = face.getCircles(), circle = circleIt.next();
      !circle.done;
      circle = circleIt.next()
    ) {
      // Initialize the circle's properties uniform input.
      circle.value.propsBuffer = this.context.device.createBuffer({
        size: Calc.roundUp(16, circle.value.props.byteLength),
        // eslint-disable-next-line no-bitwise
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });
      this.context.device.queue.writeBuffer(
        circle.value.propsBuffer,
        0,
        circle.value.props,
        0,
        circle.value.props.length,
      );

      // Initialize the circle's vertices buffer for compute output.
      circle.value.verticesBuffer = this.context.device.createBuffer({
        size: Calc.roundUp(16, circle.value.vertices.byteLength),
        // eslint-disable-next-line no-bitwise
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.VERTEX
          | GPUBufferUsage.COPY_SRC,
      });

      // Group the buffers to the compute layout.
      circle.value.computeBindGroup = this.context.device.createBindGroup({
        entries: [
          { binding: 0, resource: { buffer: circle.value.propsBuffer } },
          { binding: 1, resource: { buffer: circle.value.verticesBuffer } },
        ],
        layout: this.computeBindGroupLayout,
      });
    }
  }

  /**
   * Computes the vertices for each circle composing the face by creating and
   * submitting a compute pass.
   *
   * @param {Face} face - The face with initialized buffers and without computed
   *    vertices.
   */
  computeFaceVertices(face) {
    for (
      let circleIt = face.getCircles(), circle = circleIt.next();
      !circle.done;
      circle = circleIt.next()
    ) {
      const commandEncoder = this.context.device.createCommandEncoder();

      const computePassEncoder = commandEncoder.beginComputePass();
      computePassEncoder.setPipeline(
        circle.value instanceof SemiCircle
          ? this.computeSemiCirclePipeline
          : this.computeCirclePipeline,
      );
      computePassEncoder.setBindGroup(0, circle.value.computeBindGroup);
      computePassEncoder.dispatchWorkgroups(
        circle.value.numDivisions / this.computeConstants.workGroupSize,
      );
      computePassEncoder.end();

      this.context.device.queue.submit([commandEncoder.finish()]);
    }
  }
}

export default Model;
