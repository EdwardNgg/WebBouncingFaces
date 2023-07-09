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
  }
}

export default Model;
