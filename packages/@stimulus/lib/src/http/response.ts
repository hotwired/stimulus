class _Response {
  readonly response: Response

  constructor(response: Response) {
    this.response = response
  }

  get statusCode() {
    return this.response.status
  }

  get ok() {
    return this.response.ok
  }

  get unauthenticated() {
    return this.statusCode == 401
  }

  get authenticationURL() {
    return this.response.headers.get("WWW-Authenticate")
  }

  get contentType() {
    const contentType = this.response.headers.get("Content-Type") || ""
    return contentType.replace(/;.*$/, "")
  }

  get html() {
    if (this.contentType.match(/^(application|text)\/(html|xhtml\+xml)$/)) {
      return this.response.text()
    } else {
      return Promise.reject(`Expected an HTML response but got "${this.contentType}" instead`)
    }
  }

  get json() {
    if (this.contentType.match(/^application\/json/)) {
      return this.response.json()
    } else {
      return Promise.reject(`Expected a JSON response but got "${this.contentType}" instead`)
    }
  }
}

export { _Response as Response }
