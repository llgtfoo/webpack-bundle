"use strict"
const React = require("react")
require("../style/index.less")
// import Text from "./autoImport"
class Search extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      Texts: null,
    }
  }
  //   autoImport = () => {
  //     //import动态导入
  //     import("./autoImport.js").then((text) => {
  //       // console.log(text)
  //       this.setState({ Texts: text.default })
  //     })
  //   }
  render() {
    return (
      <div>
        {/* <Text /> */}I am react page server demo
        {/* {Texts ? <Texts /> : null} */}
        {/* <button onClick={this.autoImport}>auto import </button> */}
      </div>
    )
  }
}

module.exports = <Search />
