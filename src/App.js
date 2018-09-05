import React, { Component } from "react";
import "./App.css";

import web3 from "./web3";
import lottery from "./lottery";

class App extends Component {
  // constructor(props) {
  // super(props);
  // this.state = { manager: "" };
  // }
  state = {
    manager: "",
    players: [],
    balance: "",
    value: "",
    message: ""
  };

  async componentDidMount() {
    // console.log(web3.version);
    // web3.eth.getAccounts().then(console.log);
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ manager, players, balance });
  }

  onSubmit = async e => {
    e.preventDefault();
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Waiting on transaction success..." });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether")
    });

    this.setState({ message: "You have been entered!" });
  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Waiting on transaction success..." });

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({ message: "A winner has been picked!" });
  };

  render() {
    let message;
    if (this.state.message) {
      message = (
        <div class="alert alert-info">
          <strong>Info</strong> {this.state.message}
        </div>
      );
    } else {
      message = "";
    }

    return (
      <React.Fragment>
        <nav className="navbar navbar-dark bg-dark mb-5">
          <span className="navbar-brand mb-0 h1 mx-auto">Lottery Contract</span>
        </nav>
        <div className="container">
          <p> This contract is managed by: {this.state.manager}.</p>
          <p>
            Currently there are {this.state.players.length} people entered,
            competing to win {web3.utils.fromWei(this.state.balance, "ether")}{" "}
            ether.
          </p>
          <hr />
          <h4>Want to try your luck?</h4>
          <form onSubmit={this.onSubmit} className="form-inline">
            <label for="ether">Amount of Ether to enter:</label>
            <input
              className="form-control mx-2"
              id="ether"
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />
            <button className="btn btn-primary">Enter</button>
          </form>

          <hr />

          <h4>Ready to pick a winner?</h4>
          <button onClick={this.onClick} className="btn btn-success">
            Pick a winner!
          </button>

          <hr />

          {message}
        </div>
      </React.Fragment>
    );
  }
}

export default App;
