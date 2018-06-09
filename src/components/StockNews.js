import React, { Component } from 'react'

class StockNews extends Component {
  render() {
    return (
      <div 
        className="text-left" 
        style={{display: this.props.show}}
      >
        <h2>Recent News</h2>
        <ul>
          {this.props.news.map(n => (
            <li key={n.headline}><a href={n.url} target="_blank">{n.headline}</a></li>
          ))}
        </ul>
      </div>
    )
  }
}

export default StockNews;