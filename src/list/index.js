import React, { Component } from "react"
import ReactDom from "react-dom"
import "../style/index.less"
// import Text from "./autoImport"
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      Texts: null,
    }
  }
  autoImport = () => {
    //import动态导入
    import("./autoImport.js").then((text) => {
      // console.log(text)
      this.setState({ Texts: text.default })
    })
  }
  render() {
    const { Texts } = this.state
    return (
      <div>
        {/* <Text /> */}I am react page demo
        {Texts ? <Texts /> : null}
        <button onClick={this.autoImport}>auto import </button>
      </div>
    )
  }
}

ReactDom.render(<App />, document.getElementById("app"))
