import { TokenListObserver, TokenListObserverDelegate } from "./token_list_observer"

export interface TokenSource {
  element: Element
  attributeName: string
  value: string
}

export interface Token<T> {
  source: TokenSource
  value: T
}

interface ParseResult<T> {
  token?: Token<T>
  error?: Error
}

export interface TokenObserverDelegate<T> {
  parseValueFromTokenSource(source: TokenSource): T
  handleErrorParsingTokenSource(error: Error, source: TokenSource)
  elementMatchedToken(token: Token<T>)
  elementUnmatchedToken(token: Token<T>)
}

export class TokenObserver<T> implements TokenListObserverDelegate {
  private tokenListObserver: TokenListObserver
  private delegate: TokenObserverDelegate<T>

  constructor(element: Element, attributeName: string, delegate: TokenObserverDelegate<T>) {
    this.tokenListObserver = new TokenListObserver(element, attributeName, this)
    this.delegate = delegate
  }

  get started(): boolean {
    return this.tokenListObserver.started
  }

  start() {
    this.tokenListObserver.start()
  }

  stop() {
    this.tokenListObserver.stop()
  }

  refresh() {
    this.tokenListObserver.refresh()
  }

  get element(): Element {
    return this.tokenListObserver.element
  }

  // Token list observer delegate

  elementMatchedTokenForAttribute(element: Element, value: string, attributeName: string) {
    const source = { element, attributeName, value }
    const { token, error } = this.parseTokenSource(source)

    if (token) {
      this.delegate.elementMatchedToken(token)
    } else if (error) {
      this.delegate.handleErrorParsingTokenSource(error, source)
    }
  }

  elementUnmatchedTokenForAttribute(element: Element, value: string, attributeName: string) {
    const { token } = this.parseTokenSource({ element, attributeName, value })
    if (token) {
      this.delegate.elementUnmatchedToken(token)
    }
  }

  private parseTokenSource(source: TokenSource): ParseResult<T> {
    try {
      return { token: { source, value: this.delegate.parseValueFromTokenSource(source) } }
    } catch (error) {
      return { error }
    }
  }
}
