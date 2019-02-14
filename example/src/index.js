import "./scss";
import React from "react";
import ReactDOM from "react-dom";

class Test extends React.Component {
  state = { name: "nobody" };
  componentDidMount() {
    setTimeout(() => this.setState({ name: "root" }), 1500);
  }
  render = () => <div>Hello, {this.state.name}!</div>;
}

ReactDOM.render(<Test />, document.getElementById("app"));
