const fs = require("fs")
const path = require("path")
const express = require("express")
const webpack = require("webpack")
const webpackMiddleware = require("webpack-dev-middleware")
const webpackConfig = require("./webpack.config")

const app = express()
const port = 9000
const publicPath = path.join(__dirname, "public")
const viewPath = path.join(__dirname, "views")
const viewEngine = "ejs"

app.set("views", viewPath)
app.set("view engine", viewEngine)

app.use(express.static(publicPath))
app.use(webpackMiddleware(webpack(webpackConfig)))

const pages = [
  { path: "/hello", title: "Hello" },
  { path: "/clipboard", title: "Clipboard" },
  { path: "/slideshow", title: "Slideshow" },
  { path: "/content-loader", title: "Content Loader" },
]

app.get("/", (req, res) => {
  res.redirect(pages[0].path)
})

app.get("/uptime", (req, res, next) => {
  res.send(`<span data-content-loader-target="item">${process.uptime().toString()}</span>`)
})

app.get("/:page", (req, res, next) => {
  const currentPage = pages.find(page => page.path == req.path)
  res.render(req.params.page, { pages, currentPage })
})

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}/`)
})
