module.exports = function (source) {
  console.log(this.query) //获取options参数
  return source.replace("hello", this.query.llgtfoo)
  // this.callback
  // this.async 返回this.callback
}
