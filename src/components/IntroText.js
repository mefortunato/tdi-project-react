import React from 'react';

const IntroText = () => (
  <div className="row">
    <div className="col-12" style={{marginTop: "25px"}}>
      <h1 className="display-4">Historical Stock Prices</h1>
      <p className="lead">This is an example application built using the <a href="https://reactjs.org/" target="_blank" rel="noopener noreferrer">React</a> javascript framework. Enter a stock ticker symbol below to see historical closing prices. The data is queried from the <a href="https://iextrading.com/developer/" target="_blank" rel="noopener noreferrer">IEX Financial Data API</a>, and an interactive plot is created using <a href="https://plot.ly/" target="_blank" rel="noopener noreferrer">Plotly</a>.</p>
      <p className="lead">An alternative version of this web app was also created using the <a href="http://flask.pocoo.org/" target="_blank" rel="noopener noreferrer">Flask</a> Python microframework and can be seen <a href="http://mef-tdi-flask.herokuapp.com" target="_blank" rel="noopener noreferrer">here</a>.</p>
    </div>
  </div>
)

export default IntroText;