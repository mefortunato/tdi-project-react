import './App.css';
import React, { Component } from 'react';
import moment from 'moment';
import ErrorMessage from './components/ErrorMessage';
import IntroText from './components/IntroText';
import NavBar from './components/NavBar';
import StockNews from './components/StockNews';
import StockPlot from './components/StockPlot';
import StockLogo from './components/StockLogo'
import StockForm from './components/StockForm'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticker: '',
      data: [],
      startDate: moment().subtract(1, 'months'),
      endDate: moment(),
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
  
  handleSubmit(event) {
    Promise.all([
      fetch('https://api.iextrading.com/1.0/stock/'+this.state.ticker+'/chart/5y'),
      fetch('https://api.iextrading.com/1.0/stock/'+this.state.ticker+'/logo'),
      fetch('https://api.iextrading.com/1.0/stock/'+this.state.ticker+'/news/last/5')
    ])
      .then((resp) => Promise.all(resp.map(res => res.json()))
        .then(([chart, logo, news]) => {
          if (chart.length > 0) {
            var dates = chart.map(obj => obj.date);
            console.log(dates)
            var prices = chart.map(obj => Number(obj.close))
            this.setState({
              data: [{
                  x: dates,
                  y: prices,
              }],
              startDate: moment(dates[0]),
              endDate: moment(dates[dates.length-1]),
              minDate: moment(dates[0]),
              maxDate: moment(dates[dates.length-1]),
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
      <div className="container">
        <NavBar />
        <IntroText />
        <ErrorMessage error={this.state.error} show={this.state.showError}/>
        <StockForm
          suggestions={this.state.suggestions}
          ticker={this.state.ticker}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          onSubmit={this.handleSubmit}
          handleChange={this.handleChange}
          startDate={this.state.startDate}
          endDate={this.state.endDate}
        />
        <StockPlot
          data={this.state.data}
          currentSymbol={this.state.currentSymbol}
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          yMin={this.state.yMin}
          yMax={this.state.yMax}
          logo={this.state.logo}
        />
        <div class="row">
          <div class="col-2 text-center">
            <StockLogo
              showLogo={this.state.showLogo}
              logo={this.state.logo}
            />
          </div>
          <div class="col-10">
            <StockNews
              news={this.state.news}
              show={this.state.showNews}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
