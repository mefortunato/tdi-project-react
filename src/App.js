import React, { Component } from 'react';
import Plot from 'react-plotly.js';
import './App.css';

import Autosuggest from 'react-autosuggest';

import { Form, FormGroup, ControlLabel, Button  } from 'react-bootstrap';

import DatePicker from 'react-16-bootstrap-date-picker'

const Error = ({error, show}) => (
  <div className="alert alert-danger" role="alert" style={{width: '50%', margin: '10px auto', display: show}}>
    {error}
  </div>
)

const News = ({news, show}) => (
  <div class="col-md-4 col-md-offset-4 text-left" style={{display: show}}>
    <h2>Recent News</h2>
    <ul>
      {news.map(n => (
        <li key={n.headline}><a href={n.url} target="_blank">{n.headline}</a></li>
      ))}
    </ul>
  </div>
);

class App extends Component {
  getSuggestions(value) {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : this.state.symbols.filter(symbol =>
      symbol.symbol.toLowerCase().slice(0, inputLength) === inputValue
    );
  };

  getSuggestionValue(suggestion) {
    return suggestion.symbol;
  }

  renderSuggestion(suggestion, { query, isHighlighted }) {
    return (
      <div>
        {suggestion.symbol}
      </div>
    );
  }

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
      symbols: [],
      suggestions: [],
      currentSymbol: {name: '', symbol: ''},
      logo: '',
      news: [],
      showLogo: 'none',
      showNews: 'none',
      error: '',
      showError: 'none'
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
        this.setState({symbols: json.map(obj => ({symbol: obj.symbol, name: obj.name}))})
      })
  }
  
  handleChange(event, { newValue }) {
    var curr = this.state.currentSymbol;
    for (var obj of this.state.symbols) {
      if (obj.symbol === newValue) {
        curr = obj;
      }
    }
    this.setState({
      ticker: newValue,
      currentSymbol: curr
    });
  }

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };
  
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
    Promise.all([
      fetch('https://api.iextrading.com/1.0/stock/'+this.state.ticker+'/chart/5y'),
      fetch('https://api.iextrading.com/1.0/stock/'+this.state.ticker+'/logo'),
      fetch('https://api.iextrading.com/1.0/stock/'+this.state.ticker+'/news/last/5')
    ])
      .then((resp) => Promise.all(resp.map(res => res.json()))
        .then(([chart, logo, news]) => {
          console.log(news)
          if (chart.length > 0) {
            var dates = chart.map(obj => obj.date);
            var prices = chart.map(obj => Number(obj.close))
            this.setState({
              data: [{
                  x: dates,
                  y: prices,
              }],
              startDate: dates[0],
              endDate: dates[dates.length-1],
              minDate: dates[0],
              maxDate: dates[dates.length-1],
              logo: logo.url,
              news: news,
              showLogo: '',
              showNews: '',
              showError: 'none'
            })
          }
          else {
            alert('Cannot query '+this.state.ticker)
          }
        })
      )
      .catch(error => {
        this.setState({
          data: [],
          logo: '',
          showLogo: 'none',
          showNews: 'none',
          news: [],
          currentSymbol: {name: '', symbol: ''},
          error: 'Cannot query ticker: '+this.state.ticker,
          showError: ''
        })
      })
    event.preventDefault();
  }
  
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };
 
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };
  
  render() {
    return (
      <div className="App">
        <Error error={this.state.error} show={this.state.showError}/>
        <ControlLabel>Ticker</ControlLabel>{' '}
        <Form inline onSubmit={this.handleSubmit}>
          <FormGroup>
            <Autosuggest
              suggestions={this.state.suggestions}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested}
              getSuggestionValue={this.getSuggestionValue}
              renderSuggestion={this.renderSuggestion}
              inputProps={{placeholder: 'GOOG', value: this.state.ticker, onChange: this.handleChange}}
              highlightFirstSuggestion={true}
            />
            <Button type="submit">Submit</Button>
          </FormGroup>
        </Form>
        <ControlLabel style={{paddingTop: "20px"}}>Date Range</ControlLabel>{' '}
        <Form inline>
          <FormGroup style={{display: "inline-table"}}>
            <DatePicker 
              id="start-datepicker"
              style={{width: "100px"}}
              dateFormat="YYY-MM-DD"
              maxDate={this.state.maxDate}
              minDate={this.state.minDate}
              value={this.state.startDate}
              onChange={this.handleDateChangeStart}
            />
            <DatePicker
              id="end-datepicker"
              style={{width: "100px"}}
              dateFormat="YYY-MM-DD"
              maxDate={this.state.maxDate}
              minDate={this.state.minDate}
              value={this.state.endDate}
              onChange={this.handleDateChangeEnd}
            />
          </FormGroup>{' '}
        </Form>
        <div style={{'marginTop': '15px', 'display': this.state.showLogo}}>
          <img src={this.state.logo} alt="Company Logo"/>
        </div>
        <Plot
          className="d-flex justify-content-center"
          data={this.state.data}
          style={{width: '75%', margin: '0 auto'}}
          useResizeHandler={true}
          layout={
            {
              title: this.state.currentSymbol.name,
              margin: {
                l: 100,
                r: 100,
                t: 50,
                b: 50,
                pad: 4
              },
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
          config={{displayModeBar: false}}
        />
        <News news={this.state.news} show={this.state.showNews}/>
      </div>
    );
  }
}

export default App;
