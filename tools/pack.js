/*eslint no-console: ["error", { allow: ["error", "info"] }] */
/*global __dirname*/

const fs = require("fs")
const path = require("path")
const archiver = require("archiver")

const folderSrc = path.join(__dirname, "../dist")
const folderDist = path.join(__dirname, "../pack")

const zip = (src, dist, zipFilename) => {
  console.info(`\nZipping dist folder... ${zipFilename}`)
  const archive = archiver("zip", { zlib: { level: 9 } })
  const stream = fs.createWriteStream(path.join(dist, zipFilename))
  return new Promise((resolve, reject) => {
    archive
      .directory(src, false)
      .on("error", err => reject(err))
      .pipe(stream)
    stream.on("close", resolve)
    archive.finalize()
  })
}

const { name, version } = require(path.join(__dirname, "../package.json"))
const zipFilename = `${name}-v${version}.zip`

if (!fs.existsSync(folderDist)) fs.mkdirSync(folderDist)

zip(folderSrc, folderDist, zipFilename)
  .then(() => console.info("Zip ok!", "\n"))
  .catch(err => console.error(err))
