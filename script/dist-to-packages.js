const fs = require("fs-extra")
const path = require("path")

const rootPath = path.resolve(__dirname, "..")

const tsconfigPath = path.join(rootPath, "tsconfig.json")
const tsconfig = require(tsconfigPath)
const { outDir, declarationDir, rootDir } = tsconfig.compilerOptions

const sourcePackagesPath = path.join(rootPath, outDir)
const sourceTypesPath = path.join(rootPath, declarationDir)
const packagesPath = path.join(rootPath, rootDir)

// Copy compiled .js files to packages/*/dist/module
fs.readdirSync(sourcePackagesPath).forEach(packageName => {
  const srcPath = path.join(sourcePackagesPath, packageName)
  const destPath = path.join(packagesPath, packageName, "dist", "module")
  fs.ensureDirSync(destPath)
  fs.copySync(srcPath, destPath)
})

// Copy .d.ts files to packages/*/dist/types
fs.readdirSync(sourceTypesPath).forEach(packageName => {
  const srcPath = path.join(sourceTypesPath, packageName)
  const destPath = path.join(packagesPath, packageName, "dist", "types")
  fs.ensureDirSync(destPath)
  fs.copySync(srcPath, destPath)
})
