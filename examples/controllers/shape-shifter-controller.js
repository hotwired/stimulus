import Controller from "./controller"

const SHAPES = ["circle", "triangle"]

export default class extends Controller {
  initialize() {
    this.targets.findAll("shape").forEach((element) => {
      const shape = this.getRandomShape()
      element.classList.add(shape)
    })
  }

  toggle(event) {
    const {classList} = event.target
    SHAPES.forEach(function(shape) {
      const isShape = classList.contains(shape)
      classList.toggle(shape, !isShape)
      classList.toggle(shape, !isShape)
    })
  }

  getRandomShape() {
    return SHAPES[Math.floor(Math.random() * SHAPES.length)]
  }
}
