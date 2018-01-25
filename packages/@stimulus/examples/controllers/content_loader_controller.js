import { Controller } from "stimulus"

export default class extends Controller {
  connect() {
    if (!this.loaded) {
      this.load()
    }
  }

  disconnect() {
    this.abort()
  }

  load() {
    const xhr = this.xhr = new XMLHttpRequest
    xhr.open("GET", this.url, true)
    xhr.onload = () => {
      this.content = xhr.response
      this.loaded = true
    }
    xhr.send()
  }

  abort() {
    if (this.xhr) {
      this.xhr.abort()
    }
  }

  get url() {
    return this.data.get("url")
  }

  get loaded() {
    return this.data.has("loaded")
  }

  set loaded(value) {
    this.data.set("loaded", value)
  }

  set content(value) {
    this.element.innerHTML = value
  }
}
