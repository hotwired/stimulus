import resolve from "@rollup/plugin-node-resolve"
import { terser } from "rollup-plugin-terser"
import { version } from "../../lerna.json"

const year = new Date().getFullYear()
const banner = `/*\nStimulus ${version}\nCopyright © ${year} Basecamp, LLC\n */`

const terserOptions = {
  mangle: false,
  compress: false,
  format: {
    beautify: true,
    indent_level: 2,
    comments: /Copyright/
  }
}

export default {
  input: "index.js",
  output: {
    file: "dist/stimulus.umd.js",
    format: "umd",
    name: "Stimulus",
    banner
  },
  context: "window",
  plugins: [
    resolve(),
    terser(terserOptions)
  ]
}
