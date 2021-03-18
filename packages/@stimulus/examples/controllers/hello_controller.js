import { BikeshedController } from "stimulus"

export default class extends BikeshedController
  .target("name")
{
  greet() {
    alert(`Hello, ${this.name}!`)
  }

  get name() {
    return this.nameTarget.value
  }
}
