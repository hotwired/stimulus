import { app } from "../app"

const SHAPES = ["circle", "triangle"]

app.register("shape-shifter", class extends Stimulus.Controller {
  initialize() {
    console.log("shape-shifter#initialize", this.identifier, this.element)
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
})
