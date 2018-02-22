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
  handleErrorParsingTokenSource?(error: Error, source: TokenSource)
  elementMatchedToken(token: Token<T>)
  elementUnmatchedToken(token: Token<T>)
}

export class TokenObserver<T> implements TokenListObserverDelegate {
  private tokenListObserver: TokenListObserver
  private delegate: TokenObserverDelegate<T>
  private parseResultsByElementAndValue: WeakMap<Element, Map<string, ParseResult<T>>>

  constructor(element: Element, attributeName: string, delegate: TokenObserverDelegate<T>) {
    this.tokenListObserver = new TokenListObserver(element, attributeName, this)
    this.delegate = delegate
    this.parseResultsByElementAndValue = new WeakMap
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
    const { token, error } = this.fetchParseResultForElementAndValue(element, value)
    if (token) {
      this.delegate.elementMatchedToken(token)
    } else if (error && this.delegate.handleErrorParsingTokenSource) {
      this.delegate.handleErrorParsingTokenSource(error, { element, attributeName, value })
    }
  }

  elementUnmatchedTokenForAttribute(element: Element, value: string, attributeName: string) {
    const { token } = this.fetchParseResultForElementAndValue(element, value)
    if (token) {
      this.delegate.elementUnmatchedToken(token)
    }
  }

  private fetchParseResultForElementAndValue(element: Element, value: string): ParseResult<T> {
    const parseResultsByValue = this.fetchParseResultsByValueForElement(element)
    let parseResult = parseResultsByValue.get(value)

    if (!parseResult) {
      parseResult = this.parseTokenSource({ element, attributeName: this.attributeName, value })
      parseResultsByValue.set(value, parseResult)
    }

    return parseResult
  }

  private fetchParseResultsByValueForElement(element: Element): Map<string, ParseResult<T>> {
    let parseResultsByValue = this.parseResultsByElementAndValue.get(element)

    if (!parseResultsByValue) {
      parseResultsByValue = new Map
      this.parseResultsByElementAndValue.set(element, parseResultsByValue)
    }

    return parseResultsByValue
  }

  private parseTokenSource(source: TokenSource): ParseResult<T> {
    try {
      return { token: { source, value: this.delegate.parseValueFromTokenSource(source) } }
    } catch (error) {
      return { error }
    }
  }
}
