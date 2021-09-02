import { Application, Controller } from "../../../core"

export function startApplication() {
  const startState = document.readyState

  class PostMessageController extends Controller {
    itemTargets!: Element[]

    static targets = [ "item" ]

    connect() {
      const connectState = document.readyState
      const targetCount = this.itemTargets.length
      const message = JSON.stringify({ startState, connectState, targetCount })
      parent.postMessage(message, location.origin)
    }
  }

  const application = Application.start()
  application.register("a", PostMessageController)
}
