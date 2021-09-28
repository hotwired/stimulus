import { Controller } from "../../core/controller"

class BaseTargetController extends Controller {
  static targets = [ "alpha" ]

  alphaTarget!: Element | null
  alphaTargets!: Element[]
  hasAlphaTarget!: boolean
}

export class TargetController extends BaseTargetController {
  static classes = [ "connected", "disconnected" ]
  static targets = [ "beta", "input", "recursive" ]
  static values = { inputTargetConnectedCallCount: Number, inputTargetDisconnectedCallCount: Number, recursiveTargetConnectedCallCount: Number, recursiveTargetDisconnectedCallCount: Number }

  betaTarget!: Element | null
  betaTargets!: Element[]
  hasBetaTarget!: boolean

  inputTarget!: Element | null
  inputTargets!: Element[]
  hasInputTarget!: boolean

  hasConnectedClass!: boolean
  hasDisconnectedClass!: boolean
  connectedClass!: string
  disconnectedClass!: string

  inputTargetConnectedCallCountValue = 0
  inputTargetDisconnectedCallCountValue = 0
  recursiveTargetConnectedCallCountValue = 0
  recursiveTargetDisconnectedCallCountValue = 0

  inputTargetConnected(element: Element) {
    if (this.hasConnectedClass) element.classList.add(this.connectedClass)
    this.inputTargetConnectedCallCountValue++
  }

  inputTargetDisconnected(element: Element) {
    if (this.hasDisconnectedClass) element.classList.add(this.disconnectedClass)
    this.inputTargetDisconnectedCallCountValue++
  }

  recursiveTargetConnected(element: Element) {
    element.remove()

    this.recursiveTargetConnectedCallCountValue++
    this.element.append(element)
  }

  recursiveTargetDisconnected(element: Element) {
    this.recursiveTargetDisconnectedCallCountValue++
  }
}
