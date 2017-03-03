addEventListener("DOMContentLoaded", function() {
  const listElement = document.querySelector("[data-examples]")
  const containerElement = document.querySelector("[data-container]")

  listElement.addEventListener("click", function(event) {
    event.preventDefault()
    let url = event.target.href
    if (!url) return

    if (url === containerElement.dataset.url) {
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

  })
})

