import React, { Component } from 'react';
import Plot from 'react-plotly.js';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DateRangePicker } from 'react-dates';
import moment from 'moment';
import './App.css';

var ALPHA_KEY = '6L2H35SLCTWIW7IF'

class App extends Component {
  constructor(props) {
    super(props);
    var today = new moment();
    this.state = {
      ticker: '',
      data: [],
      startDate: new moment().subtract(1, 'months'),
      endDate: today,
      focusedInput: null,
      yMin: 0,
      yMax: 100,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
  }
  
  handleChange(event) {
    this.setState({ticker: event.target.value});
  }
  
  handleDateChange({ startDate, endDate }) {
    var yMin = this.state.yMin;
    var yMax = this.state.yMax;
    if (this.state.data.length > 0) {
      var stopIndex = this.state.data[0]['x'].indexOf(startDate.format('YYYY-MM-DD'));
      var startIndex = this.state.data[0]['x'].indexOf(endDate.format('YYYY-MM-DD'));
      if (startIndex === -1) {
        startIndex = 0
      }
      var dataRange = this.state.data[0]['y'].slice(startIndex, stopIndex);
      yMin = Math.min(...dataRange)-10;
      yMax = Math.max(...dataRange)+10;
    }
    this.setState({
      startDate: startDate,
      endDate: endDate,
      yMin: yMin,
      yMax: yMax,
    })
  }
  
  handleSubmit(event) {
    fetch('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&outputsize=full&symbol='+this.state.ticker+'&apikey='+ALPHA_KEY)
      .then(resp => resp.json())
      .then(json => {
        if (json['Time Series (Daily)']) {
          console.log(json)
          this.setState({data: [
            {
              x: Object.keys(json['Time Series (Daily)']),
              y: Object.values(json['Time Series (Daily)']).map(obj => Number(obj['4. close']))
            }
          ]})
        }
        else {
          alert('Cannot query '+this.state.ticker)
          this.setState({data: []})
        }
      })
    event.preventDefault();
  }
  
  render() {
    return (
      <div className="App">
        <form onSubmit={this.handleSubmit}>
          <input type="text" value={this.state.ticker} onChange={this.handleChange} />
          <input type="submit" value="Submit" />
          <div>
            Pick Date Range:
            <DateRangePicker 
              small
              noBorder
              showDefaultInputIcon
              startDateId="startDate"
              endDateId="endDate"
              startDate={this.state.startDate}
              endDate={this.state.endDate}
              onDatesChange={this.handleDateChange}
              focusedInput={this.state.focusedInput}
              onFocusChange={(focusedInput) => { this.setState({ focusedInput })}}
              isOutsideRange={(date) => {
                if (this.state.data.length > 0) {
                  if (this.state.data[0]['x'].includes(date.format('YYYY-MM-DD'))) {
                    return false
                  }
                  else {
                    return true
                  }
                }
                else {
                  return false
                }
              }}
            />
          </div>
        </form>
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
                range: [this.state.startDate.toDate(), this.state.endDate.toDate()],
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
