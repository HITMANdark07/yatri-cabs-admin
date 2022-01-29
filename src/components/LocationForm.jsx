import axios from 'axios';
import React, { useState } from 'react';
import { isAuthenticated } from '../auth';
import makeToast from '../Toaster';

function LocationForm({getLocs}) {
    const [location, setLocation] = useState("");
    const [loading, setLoading] = useState(false);

    const submitHandler = (event) => {
        setLoading(true);
        event.preventDefault();
        axios({
            method:'POST',
            url:`${process.env.REACT_APP_API}/admin/location/add/${isAuthenticated()?.admin._id}`,
            data:{
                location:location
            },
            headers:{
                Authorization:`Bearer ${isAuthenticated().token}`
            }
        }).then((res) => {
            if(res.status===200){
                makeToast("success", res?.data?.location+" added Successfully");
                setLocation("");
                getLocs();
            }
            setLoading(false);
        }).catch((err) => {
            console.log(err.response.data);
            makeToast("error", err.response.data.error);
            setLoading(false);
        })
    }
  return (<div>
      <div className='form-container'>
          <form className='form' onSubmit={submitHandler}>
              <label htmlFor='location'>Location <span style={{color:'red'}}>*</span></label>
              <input name='location' id='location' className='form-input' value={location} onChange={(e) => setLocation(e.target.value)} placeholder='Enter Location' />
              <button className='submit' type='submit' disabled={loading}>{loading ? "ADDING":"ADD LOCATION"}</button>
          </form>
      </div>
  </div>);
}

export default LocationForm;
