import React from 'react';
import Autosuggest from 'react-autosuggest';

const StockForm = (props) => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-12 text-center">
          <form autoComplete="off" onSubmit={props.onSubmit}>
            <div className="form-inline d-flex justify-content-center autocomplete">
              <label className="sr-only">Ticker: </label>
              <Autosuggest
                suggestions={props.suggestions}
                onSuggestionsFetchRequested={props.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={props.onSuggestionsClearRequested}
                getSuggestionValue={props.getSuggestionValue}
                renderSuggestion={props.renderSuggestion}
                inputProps={{placeholder: 'GOOG', value: props.ticker, onChange: props.handleChange}}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default StockForm;