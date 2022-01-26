import React from 'react';
import Header from '../components/Header';

function NotFound() {
  return <div>
      <Header />
      <p style={{fontSize:40, fontWeight:'300', marginTop:200, textAlign:'center'}}>404 Page Not Found Error!</p>
  </div>;
}

export default NotFound;
