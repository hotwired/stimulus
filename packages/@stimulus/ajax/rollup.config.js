import commonjs from "rollup-plugin-commonjs"
import resolve from "rollup-plugin-node-resolve"
import replace from "rollup-plugin-replace"

export default {
  input: "demo/demo.js",
  output: {
    file: "dist/demo.js",
    format: "iife"
  },
  plugins: [
    replace({ "process.env.NODE_ENV": "'production'" }),
    resolve(),
    commonjs()
  ]
}
