import { Response } from "./response"

type Body = FormData | File | string
type ResponseKind = "html" | "json"

type Options = {
  contentType?: string,
  responseKind?: ResponseKind,
  body?: Body
}

export class Request {
  readonly method: string
  readonly url: string
  readonly options: Options

  constructor(method: string, url: string, options: Options = {}) {
    this.method = method
    this.url = url
    this.options = options
  }

  async perform() {
    const response = new Response(await fetch(this.url, this.fetchOptions))
    if (response.unauthenticated && response.authenticationURL) {
      return Promise.reject(window.location.href = response.authenticationURL)
    } else {
      return response
    }
  }

  get fetchOptions(): RequestInit {
    return {
      method:      this.method,
      headers:     this.headers,
      body:        this.body,
      credentials: "same-origin",
      redirect:    "follow"
    }
  }

  get headers() {
    return compact({
      "X-Requested-With": "XMLHttpRequest",
      "X-CSRF-Token":     this.csrfToken,
      "Content-Type":     this.contentType,
      "Accept":           this.accept
    })
  }

  get csrfToken() {
    const meta = Array.from(document.querySelectorAll("meta[name=csrf-token]")).slice(-1)[0]
    if (meta) {
      return meta.getAttribute("content")
    }
  }

  get contentType() {
    if (this.options.contentType) {
      return this.options.contentType
    } else if (this.body == null || this.body instanceof FormData) {
      return
    } else if (this.body instanceof File) {
      return this.body.type
    } else {
      return "application/octet-stream"
    }
  }

  get accept() {
    switch (this.responseKind) {
      case "html":
        return "text/html, application/xhtml+xml"
      case "json":
        return "application/json"
      default:
        return "*/*"
    }
  }

  get body() {
    return this.options.body
  }

  get responseKind() {
    return this.options.responseKind || "html"
  }
}

function compact(object: any) {
  const result: any = {}
  for (const key in object) {
    const value = object[key]
    if (value !== undefined) {
      result[key] = value
    }
  }
  return result
}
