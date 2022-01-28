import React from 'react';
import Header from '../components/Header';
import Tab from '../components/Tabs';

function DashBoard() {
  return <div>
      <Header/>
      <div className='main-container'>
      <Tab />
      </div>
  </div>;
}

export default DashBoard;
