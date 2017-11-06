import Controller from "stimulus"

const SHAPES = ["circle", "triangle"]

export default class ShapeShifterController extends Controller {
  initialize() {
    this.targets.findAll("shape").forEach((element) => {
      const shape = this.getRandomShape()
      element.classList.add(shape)
    })
  }

  toggle(event) {
    const {classList} = event.target
    SHAPES.forEach(function(shape) {
      if (classList.contains(shape)) {
        classList.remove(shape)
      } else {
        classList.add(shape)
      }
    })
  }

  getRandomShape() {
    return SHAPES[Math.floor(Math.random() * SHAPES.length)]
  }
}
