const fs = require("fs-extra")
const path = require("path")

const rootPath = path.resolve(__dirname, "..")

const tsconfigPath = path.join(rootPath, "tsconfig.json")
const tsconfig = require(tsconfigPath)
const { outDir, declarationDir, rootDir } = tsconfig.compilerOptions

const sourceModulesPath = path.join(rootPath, outDir)
const sourceTypesPath = path.join(rootPath, declarationDir)
const packagesPath = path.join(rootPath, rootDir)


// Copy compiled .js files to packages/*/**/dist/module
getPackageNames(sourceModulesPath).forEach(packageName => {
  const srcPath = path.join(sourceModulesPath, packageName)
  const destPath = path.join(packagesPath, packageName, "dist", "module")
  fs.ensureDirSync(destPath)
  fs.copySync(srcPath, destPath)
})

// Copy .d.ts files to packages/*/**/dist/types
getPackageNames(sourceModulesPath).forEach(packageName => {
  const srcPath = path.join(sourceTypesPath, packageName)
  const destPath = path.join(packagesPath, packageName, "dist", "types")
  fs.ensureDirSync(destPath)
  fs.copySync(srcPath, destPath)
})

function getPackageNames(rootPath) {
  const names = []
  fs.readdirSync(rootPath).forEach(name => {
    if (name.startsWith("@")) {
      const scopePath = path.join(rootPath, name)
      const scopeNames = fs.readdirSync(scopePath).map(scopedName => `${name}/${scopedName}`)
      names.push(...scopeNames)
    } else {
      names.push(name)
    }
  })
  return names
}
