import React from 'react';
import Header from '../components/Header';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { withRouter } from 'react-router-dom';

function CarsPage({history}) {
  return <div>
      <Header />
      <div className='main-container'>
          <button className='add-new-car-button' onClick={() => { history.push("/add-cars")}}><AddCircleOutlineIcon sx={{marginRight:1}}  /> ADD NEW CAR </button>
      </div>
  </div>;
}

export default withRouter(CarsPage);
