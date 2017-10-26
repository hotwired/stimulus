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
app.use(webpackMiddleware(webpack(webpackConfig), { lazy: true }))

app.get("/", (req, res) => {
  res.redirect("/expander")
})

app.get("/:page", (req, res, next) => {
  res.render(req.params.page)
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
