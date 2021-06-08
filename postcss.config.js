const autoprefixer = require("autoprefixer")
const cssnano = require("cssnano")
module.exports = {
  plugins: [
    //css兼容
    autoprefixer({
      // overrideBrowserslist: ["last 2 versions", ">1%"],
    }),
    //压缩css
    cssnano({}),
  ],
}
