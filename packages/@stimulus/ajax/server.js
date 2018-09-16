const express = require("express")
const multer = require("multer")
const path = require("path")

const app = express()
const form = multer().none()
const root = __dirname
app.listen(10001)
console.log("Listening on http://localhost:10001")

app.get("/boosts", (_, response) => {
  serve(response, index({ boosts }))
})

app.post("/boosts", form, ({ body: { name } }, response) => {
  const id = nextId++
  boosts[id] = { id, name }
  serve(response, index({ boosts }))
})

app.get("/boosts/:id", ({ params: { id } }, response) => {
  guard(response, boosts, id)
  const boost = boosts[id]
  serve(response, show({ boost }))
})

app.put("/boosts/:id", form, ({ body: { name }, params: { id } }, response) => {
  guard(response, boosts, id)
  const boost = boosts[id] = { id, name }
  serve(response, show({ boost }))
})

app.delete("/boosts/:id", ({ params: { id } }, response) => {
  guard(response, boosts, id)
  delete boosts[id]
  serve(response, "")
})

app.get("/boosts/:id/edit", ({ params: { id } }, response) => {
  const boost = boosts[id]
  serve(response, edit({ boost }))
})

app.use(express.static(path.join(root, "/dist")))
app.use(express.static(path.join(root, "/demo")))

const boosts = {
  1: { id: "1", name: "Cool" },
  2: { id: "2", name: "neat" },
  3: { id: "3", name: "Nice job" },
  "": { id: "nonexistent", name: "👻" }
}

let nextId = Object.keys(boosts).length + 1

function serve(response, body) {
  setTimeout(() => {
    response.format({ "text/html": () => response.send(body) })
  }, (Math.random() * 450) + 50)
}

function guard(response, boosts, id) {
  if (!(id in boosts)) {
    response.status(404)
    throw new Error("Not Found")
  }
}

function index({ boosts }) {
  return `
    <div class="boosts" data-controller="resource" data-resource-url="/boosts">
      <div>${ Object.keys(boosts).map(id => show({ boost: boosts[id] })).join("") }</div>
      <div class="boost new-boost">
        <form data-action="resource#create" data-target="resource.form">
          <input type="text" name="name" placeholder="Boost Sam…" data-target="resource.primaryField">
          <button type="submit">Submit</button>
          <button type="reset">Cancel</button>
        </form>
      </div>
    </div>
  `
}

function show({ boost: { id, name } }) {
  return `
    <div class="boost" data-controller="resource" data-resource-url="/boosts/${ h(id) }">
      <span>${ h(name) }</span>
      <button data-action="resource#edit">Edit</button>
      <button data-action="resource#destroy">Delete</button>
    </div>
  `
}

function edit({ boost: { id, name } }) {
  return `
    <div class="boost" data-controller="resource" data-resource-url="/boosts/${ h(id) }">
      <form data-action="resource#update" data-target="resource.form">
        <input type="text" name="name" value="${ h(name) }" data-target="resource.primaryField">
        <button type="submit">Submit</button>
        <button type="reset" data-action="click->resource#show">Cancel</button>
      </form>
    </div>
  `
}

function h(value) {
  return value.toString()
    .replace(/&/g, "&amp;")
    .replace(/"/g, '&quot;')
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}
