import { Controller } from "@stimulus/core"
import { Request } from "@stimulus/http"

export default class extends Controller {
  get resourceTarget() {
    return this.targets.find("resource") || this.element
  }

  async request(event: CustomEvent) {
    const request = new Request(this.method, this.url, { body: this.body })
    event.preventDefault()

    if (this.dispatchEvent("before-http", request)) {
      const response = await request.perform()
      if (this.dispatchEvent(response.ok ? "http-success" : "http-failure", response)) {
        this.dispatchEvent("http", response)
      }
    }
  }

  get method() {
    return this.data.get("method")
      || this.resourceTarget.getAttribute("method")
      || "get"
  }

  get url() {
    return this.data.get("url")
      || this.resourceTarget.getAttribute("href")
      || this.resourceTarget.getAttribute("action")
      || ""
  }

  get body() {
    if (this.resourceTarget instanceof HTMLFormElement) {
      return new FormData(this.resourceTarget)
    }
  }

  dispatchEvent(eventName: string, detail: any) {
    const event = createEvent(eventName, detail)
    this.resourceTarget.dispatchEvent(event)
    return !event.defaultPrevented
  }
}

function createEvent(eventName: string, detail: any) {
  const event = document.createEvent("CustomEvent")
  event.initCustomEvent(eventName, true, true, detail)
  return event
}
