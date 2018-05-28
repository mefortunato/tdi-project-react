import React, { Component } from 'react';
import Plot from 'react-plotly.js';
import './App.css';

import { Form, FormGroup, ControlLabel, FormControl, Button  } from 'react-bootstrap';
var DatePicker = require("react-16-bootstrap-date-picker");

class App extends Component {
  constructor(props) {
    super(props);
    var defaultEnd = new Date();
    var defaultStart = new Date(defaultEnd.getFullYear(), defaultEnd.getMonth()-1, defaultEnd.getDate())
    this.state = {
      ticker: '',
      data: [],
      maxDate: defaultEnd.toISOString().substring(0, 10),
      minDate: defaultStart.toISOString().substring(0, 10),
      startDate: defaultStart.toISOString().substring(0, 10),
      endDate: defaultEnd.toISOString().substring(0, 10),
      yMin: 0,
      yMax: 100,
      symbols: []
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDateChangeStart = this.handleDateChangeStart.bind(this);
    this.handleDateChangeEnd = this.handleDateChangeEnd.bind(this);
  }
  
  componentDidMount() {
    fetch('https://api.iextrading.com/1.0/ref-data/symbols')
      .then(resp => resp.json())
      .then(json => {
        this.setState({symbols: json.map(obj => ({name: obj.symbol}))})
      })
  }
  
  handleChange(event) {
    this.setState({ticker: event.target.value});
  }
  
  handleDateChangeStart(value, formattedValue) {
    var date = new Date(formattedValue);
    if (this.state.data.length > 0) {
      var dates = this.state.data[0]['x'];
      var closestDate = dates.reduce(function(prev, curr) {
        return (Math.abs(new Date(curr) - date) < Math.abs(new Date(prev) - date) ? curr : prev);
      });
      var startIndex = dates.indexOf(closestDate);
      var endIndex = dates.indexOf(this.state.endDate);
      var data = this.state.data[0]['y'].slice(startIndex, endIndex);
      this.setState({
        startDate: closestDate,
        yMin: Math.min(...data)-10,
        yMax: Math.max(...data)+10,
      });
    }
    else {
      this.setState({startDate: formattedValue});
    }
  }
  
  handleDateChangeEnd(value, formattedValue) {
    var date = new Date(formattedValue);
    if (this.state.data.length > 0) {
      var dates = this.state.data[0]['x'];
      var closestDate = dates.reduce(function(prev, curr) {
        return (Math.abs(new Date(curr) - date) < Math.abs(new Date(prev) - date) ? curr : prev);
      });
      var startIndex = dates.indexOf(this.state.startDate);
      var endIndex = dates.indexOf(closestDate);
      var data = this.state.data[0]['y'].slice(startIndex, endIndex);
      this.setState({
        endDate: closestDate,
        yMin: Math.min(...data)-10,
        yMax: Math.max(...data)+10,
      });
    }
    else {
      this.setState({endDate: formattedValue});
    }
  }
  
  handleSubmit(event) {
    fetch('https://api.iextrading.com/1.0/stock/'+this.state.ticker+'/chart/5y')
      .then(function(resp) {
        if (!resp.ok) {
            throw Error(resp.statusText);
        }
        return resp.json();
      })
      .then(json => {
        if (json.length > 0) {
          var dates = json.map(obj => obj.date);
          var prices = json.map(obj => Number(obj.close))
          this.setState({
            data: [{
                x: dates,
                y: prices,
            }],
            startDate: dates[0],
            endDate: dates[dates.length-1],
            minDate: dates[0],
            maxDate: dates[dates.length-1]
          })
        }
        else {
          alert('Cannot query '+this.state.ticker)
          
        }
      })
      .catch(error => {
        this.setState({data: []})
        alert('Cannot query ticker: '+this.state.ticker);
      })
    event.preventDefault();
  }
  
  render() {
    return (
      <div className="App">
        <Form inline onSubmit={this.handleSubmit}>
          <FormGroup>
            <ControlLabel>Ticker</ControlLabel>{' '}
            <FormControl type="text" placeholder="GOOG" value={this.state.ticker} onChange={this.handleChange}/>
          </FormGroup>{' '}
          <Button type="submit">Submit</Button>
        </Form>
        <Form inline>
          <FormGroup>
            <ControlLabel>Date Range</ControlLabel>{' '}
            <DatePicker 
              id="start-datepicker"
              style={{width: "150px"}}
              dateFormat="YYY-MM-DD"
              maxDate={this.state.maxDate}
              minDate={this.state.minDate}
              value={this.state.startDate}
              onChange={this.handleDateChangeStart}
            />
            <DatePicker
              id="end-datepicker"
              style={{width: "150px"}}
              dateFormat="YYY-MM-DD"
              maxDate={this.state.maxDate}
              minDate={this.state.minDate}
              value={this.state.endDate}
              onChange={this.handleDateChangeEnd}
            />
          </FormGroup>{' '}
        </Form>
        <Plot
          data={this.state.data}
          layout={
            {
              xaxis: {
                title: 'Date',
                type: 'date',
                showgrid: false,
                zeroline: false,
                showline: true,
                range: [this.state.startDate, this.state.endDate],
                linecolor: 'black',
                linewidth: 2,
                mirror: true
              },
              yaxis: {
                title: 'Closing Price',
                autorange: true,
                showgrid: false,
                zeroline: false,
                showline: true,
                range: [this.state.yMin, this.state.yMax],
                linecolor: 'black',
                linewidth: 2,
                mirror: true
              },
            }
          }
        />
      </div>
    );
  }
}

export default App;
