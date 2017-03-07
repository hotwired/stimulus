import { app } from "./app"

app.register("example", class extends Stimulus.Controller {
  initialize() {
    console.log("example#initialize", this.identifier, this.element)
  }

  load(event) {
    const url = event.target.href
    const containerElement = this.targets.find("container")

    if (url === this.currentURL) {
      const element = containerElement.firstChild
      containerElement.removeChild(element)
      containerElement.appendChild(element)
    } else {
      fetch(url)
        .then(function(response) {
          return response.text()
        }).then(function(body) {
          containerElement.dataset.url = url
          containerElement.innerHTML = "<div>" + body + "</div>"
        })
    }
  }

  get currentURL() {
    return this.targets.find("container").dataset.url
  }
})
