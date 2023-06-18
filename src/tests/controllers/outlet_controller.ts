import { Controller } from "../../core/controller"

class BaseOutletController extends Controller {
  static outlets = ["alpha"]

  alphaOutlet!: Controller | null
  alphaOutlets!: Controller[]
  alphaOutletElement!: Element | null
  alphaOutletElements!: Element[]
  hasAlphaOutlet!: boolean
}

export class OutletController extends BaseOutletController {
  static classes = ["connected", "disconnected"]
  static outlets = ["beta", "gamma", "delta", "omega", "namespaced--epsilon"]

  static values = {
    alphaOutletConnectedCallCount: Number,
    alphaOutletDisconnectedCallCount: Number,
    betaOutletConnectedCallCount: Number,
    betaOutletDisconnectedCallCount: Number,
    betaOutletsInConnect: Number,
    gammaOutletConnectedCallCount: Number,
    gammaOutletDisconnectedCallCount: Number,
    namespacedEpsilonOutletConnectedCallCount: Number,
    namespacedEpsilonOutletDisconnectedCallCount: Number,
  }

  betaOutlet!: Controller | null
  betaOutlets!: Controller[]
  betaOutletElement!: Element | null
  betaOutletElements!: Element[]
  hasBetaOutlet!: boolean

  namespacedEpsilonOutlet!: Controller | null
  namespacedEpsilonOutlets!: Controller[]
  namespacedEpsilonOutletElement!: Element | null
  namespacedEpsilonOutletElements!: Element[]
  hasNamespacedEpsilonOutlet!: boolean

  hasConnectedClass!: boolean
  hasDisconnectedClass!: boolean
  connectedClass!: string
  disconnectedClass!: string

  alphaOutletConnectedCallCountValue = 0
  alphaOutletDisconnectedCallCountValue = 0
  betaOutletConnectedCallCountValue = 0
  betaOutletDisconnectedCallCountValue = 0
  betaOutletsInConnectValue = 0
  gammaOutletConnectedCallCountValue = 0
  gammaOutletDisconnectedCallCountValue = 0
  namespacedEpsilonOutletConnectedCallCountValue = 0
  namespacedEpsilonOutletDisconnectedCallCountValue = 0

  connect() {
    this.betaOutletsInConnectValue = this.betaOutlets.length
  }

  alphaOutletConnected(_outlet: Controller, element: Element) {
    if (this.hasConnectedClass) element.classList.add(this.connectedClass)
    this.alphaOutletConnectedCallCountValue++
  }

  alphaOutletDisconnected(_outlet: Controller, element: Element) {
    if (this.hasDisconnectedClass) element.classList.add(this.disconnectedClass)
    this.alphaOutletDisconnectedCallCountValue++
  }

  betaOutletConnected(_outlet: Controller, element: Element) {
    if (this.hasConnectedClass) element.classList.add(this.connectedClass)
    this.betaOutletConnectedCallCountValue++
  }

  betaOutletDisconnected(_outlet: Controller, element: Element) {
    if (this.hasDisconnectedClass) element.classList.add(this.disconnectedClass)
    this.betaOutletDisconnectedCallCountValue++
  }

  gammaOutletConnected(_outlet: Controller, element: Element) {
    if (this.hasConnectedClass) element.classList.add(this.connectedClass)
    this.gammaOutletConnectedCallCountValue++
  }

  namespacedEpsilonOutletConnected(_outlet: Controller, element: Element) {
    if (this.hasConnectedClass) element.classList.add(this.connectedClass)
    this.namespacedEpsilonOutletConnectedCallCountValue++
  }

  namespacedEpsilonOutletDisconnected(_outlet: Controller, element: Element) {
    if (this.hasDisconnectedClass) element.classList.add(this.disconnectedClass)
    this.namespacedEpsilonOutletDisconnectedCallCountValue++
  }
}
