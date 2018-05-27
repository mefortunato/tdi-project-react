import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticker: '',
      reasultData: null,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleChange(event) {
    this.setState({ticker: event.target.value});
  }
  
  handleSubmit(event) {
    fetch('https://www.quandl.com/api/v3/datatables/WIKI/PRICES?ticker='+this.state.ticker+'&api_key=PyewNKgseooV1caGxUtG')
      .then(
        (res) => {
          console.log(res);
        },
        (error) => {
          console.log(error);
        })
    event.preventDefault();
  }
  
  render() {
    return (
      <div className="App">
        <form onSubmit={this.handleSubmit}>
          <input type="text" value={this.state.ticker} onChange={this.handleChange} />
          <input type="submit" value="Submit" />
        </form>
        <div> {this.state.resultData} </div>
      </div>
    );
  }
}

export default App;
