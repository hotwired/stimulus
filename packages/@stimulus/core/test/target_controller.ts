import { Controller } from "stimulus"

export class BaseTargetController extends Controller {
  static targets = [ "alpha" ]

  alphaTarget: Element | null
  alphaTargets: Element[]
}

export class TargetController extends BaseTargetController {
  static targets = [ "beta" ]

  betaTarget: Element | null
  betaTargets: Element[]
}
