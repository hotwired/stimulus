import resolve from "rollup-plugin-node-resolve"

export default {
  input: "demo/demo.js",
  output: {
    file: "dist/demo.js",
    format: "iife"
  },
  plugins: [
    resolve()
  ]
}
