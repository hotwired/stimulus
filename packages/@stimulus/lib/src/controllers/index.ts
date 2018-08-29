import css from "./css_controller"
import html from "./html_controller"
import http from "./http_controller"

export default [
  { identifier: "css", controllerConstructor: css },
  { identifier: "html", controllerConstructor: html },
  { identifier: "http", controllerConstructor: http }
]
