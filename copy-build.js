const fs = require("fs")
const path = require("path")

// Copy files to build directory
const filesToCopy = ["main.js", "manifest.json", "src/styles.css"]
const buildDir = "build"

// Ensure build directory exists
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir)
}

// Copy files
filesToCopy.forEach((file) => {
  const sourcePath = file
  const destPath = path.join(buildDir, path.basename(file))

  // Special case for styles.css
  if (file === "src/styles.css") {
    fs.copyFileSync("src/styles.css", "build/styles.css")
    // Also copy to root for GitHub workflow compatibility
    fs.copyFileSync("src/styles.css", "styles.css")
    console.log("✓ Copied styles.css to both build/ and root directory")
  } else {
    fs.copyFileSync(file, destPath)
  }
})

console.log("Files copied to build directory")
console.log("Checking for CSS files in root directory:")
const rootCssFiles = fs.readdirSync(".").filter((file) => file.endsWith(".css"))
console.log("CSS files in root:", rootCssFiles)
