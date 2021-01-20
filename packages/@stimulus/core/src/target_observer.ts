import { Context } from "./context"
import { Controller } from "./controller"
import { TokenListObserver, TokenListObserverDelegate, Token, parseTokenString } from "@stimulus/mutation-observers"

export class TargetObserver implements TokenListObserverDelegate {
  readonly context: Context
  readonly controller: Controller
  readonly attributeName: string
  private tokenListObserver: TokenListObserver

  constructor(context: Context, controller: Controller) {
    this.context = context
    this.controller = controller
    this.attributeName = `data-${context.identifier}-target`
    this.tokenListObserver = new TokenListObserver(this.context.element, this.attributeName, this)
  }

  start() {
    this.tokenListObserver.start()
  }

  stop() {
    this.tokenListObserver.stop()
  }

  tokenMatched(token: Token): void {
    if (this.controller.isConnected && this.containsDescendantWithToken(token.element, token.content)) {
      this.dispatchCallback(`${token.content}TargetAdded`, token.element)
    }
  }

  tokenUnmatched(token: Token): void {
    if (this.controller.isConnected && !this.containsDescendantWithToken(token.element, token.content)) {
      this.dispatchCallback(`${token.content}TargetRemoved`, token.element)
    }
  }

  private containsDescendantWithToken(element: Element, content: string): boolean {
    const targetTokens = parseTokenString(element.getAttribute(this.attributeName) || "", element, this.attributeName)

    return targetTokens.map(token => token.content).includes(content) && this.context.element.contains(element)
  }

  private dispatchCallback(method: string, element: Element) {
    const callback = (this.controller as any)[method]
    if (typeof callback == "function") {
      callback.call(this.controller, element)
    }
  }
}
