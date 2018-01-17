import { Controller } from "stimulus"

export class TargetController extends Controller {
  static targets = [ "alpha", "beta" ]

  alphaTarget: Element | null
  alphaTargets: Element[]

  betaTarget: Element | null
  betaTargets: Element[]
}
