const { runLoaders } = require("loader-runner")
const loaderUtils = require("loader-utils")
const path = require("path")
const fs = require("fs")
module.exports = function (source) {
  const { name } = loaderUtils.getOptions(this)
  const json = JSON.stringify(source)
    .replace("/\u2028/g", "\\u2028")
    .replace("/\u2029/g", "\\u2029")

  // <!--同步loader-- >
  // return json //单值回传
  // throw new Error()
  // this.callback(null, json, name, 1, 2, 3) //多值回传

  // <!--异步loader-- >
  const asyncBack = this.async()
  fs.readFile(path.join(__dirname, "./async.txt"), "utf-8", (err, data) => {
    if (err) {
      // throw err
      asyncBack(err, "")
    }
    asyncBack(null, data)
  })
}
