import React, { Component } from 'react';
import Plot from 'react-plotly.js';

class StockPlot extends Component {
  render() {
    return (
      <Plot
        className="d-flex justify-content-center"
        data={this.props.data}
        style={{width: '75%', margin: '25px auto'}}
        useResizeHandler={true}
        layout={
          {
            title: this.props.currentSymbol.name,
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
              range: [this.props.startDate, this.props.endDate],
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
              range: [this.props.yMin, this.props.yMax],
              linecolor: 'black',
              linewidth: 2,
              mirror: true
            }
          }
        }
        config={{displayModeBar: false}}
      />
    )
  }
}

export default StockPlot;