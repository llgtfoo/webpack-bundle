class TxtWebpackPlugin {
  constructor(options) {
    console.log(options)
  }
  apply(compiler) {
    compiler.hooks.emit.tapAsync("TxtWebpackPlugin", (compliation, cb) => {
      compliation.assets["index.txt"] = {
        source: function () {
          return "hello new plugins"
        },
        size: function () {
          return 1024
        },
      }
      //事件主体结束，调用cb
      cb()
    })
  }
}

module.exports = TxtWebpackPlugin
