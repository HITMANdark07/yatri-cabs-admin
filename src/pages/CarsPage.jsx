import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import CarDetails from '../components/CarDetails';

function CarsPage({history}) {
  const [cars, setCars] = useState([]);
  const init =() => {
    axios({
      method:'GET',
      url:`${process.env.REACT_APP_API}/car/list`,
    }).then((res) => {
      setCars(res.data);
    }).catch((err) => {
      console.log(err);
      alert("SOMETHING WENT WRONG");
    })
  }

  useEffect(() => {
    init();
  },[]);
  return <div>
      <Header />
      <div className='main-container'>
          <button className='add-new-car-button' onClick={() => { history.push("/add-cars")}}><AddCircleOutlineIcon sx={{marginRight:1}}  /> ADD NEW CAR </button>
      </div>
      <div className='category-cards-container'>
      {
        cars.map((car,i) => (
          <CarDetails car={car} key={i} />
        ))
      }
      </div>
  </div>;
}

export default withRouter(CarsPage);
