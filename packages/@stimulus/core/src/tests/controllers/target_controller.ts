import { Controller } from "../../controller"

class BaseTargetController extends Controller {
  static targets = [ "alpha" ]

  alphaTarget!: Element | null
  alphaTargets!: Element[]
  hasAlphaTarget!: boolean
}

export class TargetController extends BaseTargetController {
  static classes = [ "added", "removed" ]
  static targets = [ "beta", "input" ]
  static values = { inputTargetConnectedCallCount: Number, inputTargetDisconnectedCallCount: Number }

  betaTarget!: Element | null
  betaTargets!: Element[]
  hasBetaTarget!: boolean

  inputTarget!: Element | null
  inputTargets!: Element[]
  hasInputTarget!: boolean

  hasAddedClass!: boolean
  hasRemovedClass!: boolean
  addedClass!: string
  removedClass!: string

  inputTargetConnectedCallCountValue = 0
  inputTargetDisconnectedCallCountValue = 0

  inputTargetConnected(element: Element) {
    this.inputTargetConnectedCallCountValue++
    if (this.hasAddedClass) element.classList.add(this.addedClass)
  }

  inputTargetDisconnected(element: Element) {
    this.inputTargetDisconnectedCallCountValue++
    if (this.hasRemovedClass) element.classList.add(this.removedClass)
  }
}
