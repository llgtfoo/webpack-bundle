// loader调试器
const { runLoaders } = require("loader-runner")
const path = require("path")
const fs = require("fs")
runLoaders(
  {
    resource: path.join(__dirname, "./demo.txt"),
    loaders: [
      {
        loader: path.join(__dirname, "./raw-laoder.js"),
        options: { name: "loader params" },
      },
    ],
    context: {
      minimize: true,
    },
    readResource: fs.readFile.bind(fs),
  },
  (err, result) => {
    if (err) {
      console.log(err)
      return
    }
    console.log(result)
  },
)
