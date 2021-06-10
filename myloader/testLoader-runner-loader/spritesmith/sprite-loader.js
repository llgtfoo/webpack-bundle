const spritesmith = require("spritesmith")
const fs = require("fs")
const path = require("path")
module.exports = function (source) {
  const asyncBall = this.async()
  const imgs = source.match(/url\((\S*)\?__sprite/g)
  const matchImages = []

  for (let i = 0; i < imgs.length; i++) {
    const img = imgs[i].match(/url\((\S*)\?__sprite/)[1]
    const str = path.join(__dirname, img)
    matchImages.push(str)
  }

  console.log(matchImages)
  spritesmith.run({ src: matchImages }, function handleResult(err, result) {
    console.log(result)
    fs.writeFileSync(path.join(process.cwd(), "dist/sprite.png"), result.iamge)
    asyncBall(null, result)
  })
}
