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

interface Result<T> {
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
  private resultsByElementAndValue: WeakMap<Element, Map<string, Result<T>>>

  constructor(element: Element, attributeName: string, delegate: TokenObserverDelegate<T>) {
    this.tokenListObserver = new TokenListObserver(element, attributeName, this)
    this.delegate = delegate
    this.resultsByElementAndValue = new WeakMap
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

  get attributeName(): string {
    return this.tokenListObserver.attributeName
  }

  // Token list observer delegate

  elementMatchedTokenForAttribute(element: Element, value: string, attributeName: string) {
    const { token, error } = this.fetchResultForElementAndValue(element, value)
    if (token) {
      this.delegate.elementMatchedToken(token)
    } else if (error) {
      this.delegate.handleErrorParsingTokenSource(error, { element, attributeName, value })
    }
  }

  elementUnmatchedTokenForAttribute(element: Element, value: string, attributeName: string) {
    const { token } = this.fetchResultForElementAndValue(element, value)
    if (token) {
      this.delegate.elementUnmatchedToken(token)
    }
  }

  private fetchResultForElementAndValue(element: Element, value: string): Result<T> {
    const resultsByValue = this.fetchResultsByValueForElement(element)
    let result = resultsByValue.get(value)

    if (!result) {
      result = this.parseTokenSource({ element, attributeName: this.attributeName, value })
      resultsByValue.set(value, result)
    }

    return result
  }

  private fetchResultsByValueForElement(element: Element): Map<string, Result<T>> {
    let resultsByValue = this.resultsByElementAndValue.get(element)

    if (!resultsByValue) {
      resultsByValue = new Map
      this.resultsByElementAndValue.set(element, resultsByValue)
    }

    return resultsByValue
  }

  private parseTokenSource(source: TokenSource): Result<T> {
    try {
      return { token: { source, value: this.delegate.parseValueFromTokenSource(source) } }
    } catch (error) {
      return { error }
    }
  }
}
