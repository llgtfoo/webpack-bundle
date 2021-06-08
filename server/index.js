if (typeof window === "undefined") {
  global.window = {}
}
const { renderToString } = require("react-dom/server")
const express = require("express")
const SSR = require("../dist/server.js")
function server(port) {
  const app = express()
  app.use(express.static("dist"))
  app.get("/server", (req, res) => {
    const str = tempalte(renderToString(SSR))
    console.log(SSR, str)
    res.status(200).send(str)
  })
  app.listen(port, () => console.log(`Example app listening on ${port} port!`))
}
server(process.env.PORT || 3000)

function tempalte(html) {
  return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <link rel="shortcut icon" href="./favicon.ico" type="image/x-icon" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ssr</title>
</head>

<body>
    <div id='root'>${html}</div>
</body>

</html>`
}
