import typescript from "rollup-plugin-typescript";

export default {
  entry: "./src/sentinella.ts",
  dest: "./dist/sentinella.js",

  plugins: [
    typescript({
      typescript: require("typescript")
    })
  ],

  format: "umd",
  moduleName: "Sentinella"
}
