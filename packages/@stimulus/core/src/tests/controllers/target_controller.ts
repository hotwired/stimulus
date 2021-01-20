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
  static values = { inputTargetAddedCallCount: Number, inputTargetRemovedCallCount: Number }

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

  inputTargetAddedCallCountValue = 0
  inputTargetRemovedCallCountValue = 0

  inputTargetAdded(element: Element) {
    this.inputTargetAddedCallCountValue++
    if (this.hasAddedClass) element.classList.add(this.addedClass)
  }

  inputTargetRemoved(element: Element) {
    this.inputTargetRemovedCallCountValue++
    if (this.hasRemovedClass) element.classList.add(this.removedClass)
  }
}
