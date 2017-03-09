import { app } from "../app"
const { Descriptor, Action } = Stimulus

app.register("close-warning", class extends Stimulus.Controller {
  initialize() {
    console.log("close-warning#initialize", this.identifier, this.element)
  }

  connect() {
    const descriptor = new Descriptor("beforeunload", "warn", true)
    this.warnAction = new Action(this, window, window, descriptor)
    this.addAction(this.warnAction)
  }

  disconnect() {
    this.removeAction(this.warnAction)
  }

  warn(event) {
    event.returnValue = "Are you sure?"
    return event.returnValue
  }
})
