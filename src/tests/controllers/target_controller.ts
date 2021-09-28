import { Controller } from "../../core/controller"

class BaseTargetController extends Controller {
  static targets = [ "alpha" ]

  alphaTarget!: Element | null
  alphaTargets!: Element[]
  hasAlphaTarget!: boolean
}

export class TargetController extends BaseTargetController {
  static classes = [ "connected", "disconnected", "attributeChanged" ]
  static targets = [ "beta", "input", "recursive" ]
  static values = { inputTargetConnectedCallCount: Number, inputTargetDisconnectedCallCount: Number, recursiveTargetConnectedCallCount: Number, recursiveTargetDisconnectedCallCount: Number, betaTargetAttributeChangedCallCountValue: Number }

  betaTarget!: Element | null
  betaTargets!: Element[]
  hasBetaTarget!: boolean

  inputTarget!: Element | null
  inputTargets!: Element[]
  hasInputTarget!: boolean

  hasConnectedClass!: boolean
  hasDisconnectedClass!: boolean
  hasAttributeChangedClass!: boolean
  connectedClass!: string
  disconnectedClass!: string
  attributeChangedClass!: string

  inputTargetConnectedCallCountValue = 0
  inputTargetDisconnectedCallCountValue = 0
  betaTargetAttributeChangedCallCountValue = 0
  recursiveTargetConnectedCallCountValue = 0
  recursiveTargetDisconnectedCallCountValue = 0

  inputTargetConnected(target: Element) {
    if (this.hasConnectedClass) target.classList.add(this.connectedClass)
    this.inputTargetConnectedCallCountValue++
  }

  inputTargetDisconnected(target: Element) {
    if (this.hasDisconnectedClass) target.classList.add(this.disconnectedClass)
    this.inputTargetDisconnectedCallCountValue++
  }

  betaTargetAttributeChanged(target: Element, attributeName: string, ...args: any[]) {
    if (this.hasAttributeChangedClass) target.classList.add(this.attributeChangedClass)
    this.betaTargetAttributeChangedCallCountValue++
    target.setAttribute(attributeName, args.join(","))
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
