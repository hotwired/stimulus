import serve from "rollup-plugin-dev-server"
import resolve from "rollup-plugin-node-resolve"

export default {
  input: "examples/application.js",
  output: {
    file: "dist/examples.js",
    format: "iife"
  },
  plugins: [
    serve(["dist", "examples"]),
    resolve()
  ]
}
