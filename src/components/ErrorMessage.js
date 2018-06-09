import React from 'react';

const ErrorMessage = ({error, show}) => (
  <div 
    className="alert alert-danger" 
    role="alert" 
    style={{width: '50%', margin: '0 auto', marginBottom: "50px", display: show}}
  >{error}</div>
)

export default ErrorMessage;