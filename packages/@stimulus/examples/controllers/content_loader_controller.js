import { Controller } from "stimulus"

export default class extends Controller {
  static values = [ "url", { name: "refreshInterval", type: "integer" } ]

  connect() {
    this.load()

    if (this.hasRefreshInterval) {
      this.startRefreshing()
    }
  }

  disconnect() {
    this.stopRefreshing()
  }

  load() {
    fetch(this.url)
      .then(response => response.text())
      .then(html => {
        this.element.innerHTML = html
      })
  }

  startRefreshing() {
    this.refreshTimer = setInterval(() => {
      this.load()
    }, this.refreshInterval)
  }

  stopRefreshing() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer)
    }
  }
}
