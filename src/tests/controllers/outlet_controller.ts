import { Controller } from "../../core/controller"

class BaseOutletController extends Controller {
  static outlets = [ "alpha" ]

  alphaOutlet!: Controller | null
  alphaOutlets!: Controller[]
  alphaOutletElement!: Element | null
  alphaOutletElements!: Element[]
  hasAlphaOutlet!: boolean
}

export class OutletController extends BaseOutletController {
  static classes = [ "connected", "disconnected" ]
  static outlets = [ "beta", "gamma", "delta", "omega" ]

  static values = {
    alphaOutletConnectedCallCount: Number,
    alphaOutletDisconnectedCallCount: Number,
    betaOutletConnectedCallCount: Number,
    betaOutletDisconnectedCallCount: Number
  }

  betaOutlet!: Controller | null
  betaOutlets!: Controller[]
  betaOutletElement!: Element | null
  betaOutletElements!: Element[]
  hasBetaOutlet!: boolean

  inputOutlet!: Controller | null
  inputOutlets!: Controller[]
  inputOutletElement!: Element | null
  inputOutletElements!: Element[]
  hasInputTarget!: boolean

  hasConnectedClass!: boolean
  hasDisconnectedClass!: boolean
  connectedClass!: string
  disconnectedClass!: string

  alphaOutletConnectedCallCountValue = 0
  alphaOutletDisconnectedCallCountValue = 0
  betaOutletConnectedCallCountValue = 0
  betaOutletDisconnectedCallCountValue = 0

  alphaOutletConnected(_outlet: Controller, element: Element) {
    if (this.hasConnectedClass) element.classList.add(this.connectedClass)
    this.alphaOutletConnectedCallCountValue++
  }

  alphaOutletDisconnected(element: Element) {
    if (this.hasDisconnectedClass) element.classList.add(this.disconnectedClass)
    this.alphaOutletDisconnectedCallCountValue++
  }

  betaOutletConnected(_outlet: Controller, element: Element) {
    if (this.hasConnectedClass) element.classList.add(this.connectedClass)
    this.betaOutletConnectedCallCountValue++
  }

  betaOutletDisconnected(element: Element) {
    if (this.hasDisconnectedClass) element.classList.add(this.disconnectedClass)
    this.betaOutletDisconnectedCallCountValue++
  }
}
