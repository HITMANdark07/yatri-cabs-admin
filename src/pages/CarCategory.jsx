import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { withRouter } from 'react-router-dom';
import VehicalDetails from '../components/VehicalDetails';
import axios from 'axios';

function CarsPage({history}) {
  const [categories, setCategories] = useState([]);
  const init =() => {
    axios({
      method:'GET',
      url:`${process.env.REACT_APP_API}/category-list`
    }).then((res) => {
      setCategories(res.data);
    }).catch((err) => {
      console.log(err);
    })
  }

  useEffect(() => {
    init();
  },[]);
  return <div>
      <Header />
      <div className='main-container'>
          <button className='add-new-car-button' onClick={() => { history.push("/add-category")}}><AddCircleOutlineIcon sx={{marginRight:1}}  /> ADD NEW CAR CATEGORY </button>
      </div>
      <div className='category-cards-container'>
      {
        categories.map((cat,i) => (
          <VehicalDetails category={cat} key={i} />
        ))
      }
      </div>
  </div>;
}

export default withRouter(CarsPage);
