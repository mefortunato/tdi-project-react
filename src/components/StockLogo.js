import React from 'react';

const StockLogo = ({showLogo, logo}) => (
  <img src={logo} alt="Company Logo" style={{marginTop: "50px", 'display': showLogo}}/>
)

export default StockLogo;