addEventListener("DOMContentLoaded", function() {
  const listElement = document.querySelector("[data-examples]")
  const containerElement = document.querySelector("[data-container]")

  listElement.addEventListener("click", function(event) {
    event.preventDefault()

    fetch(event.target.href)
      .then(function(response) {
        return response.text()
      }).then(function(body) {
        containerElement.innerHTML = body
      })
  })
})

