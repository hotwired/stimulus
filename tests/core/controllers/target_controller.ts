import { Controller } from "../../controller"

class BaseTargetController extends Controller {
  static targets = [ "alpha" ]

  alphaTarget!: Element | null
  alphaTargets!: Element[]
  hasAlphaTarget!: boolean
}

export class TargetController extends BaseTargetController {
  static classes = [ "connected", "disconnected" ]
  static targets = [ "beta", "input" ]
  static values = { inputTargetConnectedCallCount: Number, inputTargetDisconnectedCallCount: Number }

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

  inputTargetConnected(element: Element) {
    if (this.hasConnectedClass) element.classList.add(this.connectedClass)
    this.inputTargetConnectedCallCountValue++
  }

  inputTargetDisconnected(element: Element) {
    if (this.hasDisconnectedClass) element.classList.add(this.disconnectedClass)
    this.inputTargetDisconnectedCallCountValue++
  }
}
