import axios from 'axios';
import React, { useState } from 'react';
import { isAuthenticated } from '../auth';
import makeToast from '../Toaster';
import Autocomplete from "react-google-autocomplete";

function LocationForm({getLocs}) {
    const [location, setLocation] = useState({
        name:"",
        lat:"",
        lng:""
    });
    const [loading, setLoading] = useState(false);

    const submitHandler = (event) => {
        setLoading(true);
        event.preventDefault();
        axios({
            method:'POST',
            url:`${process.env.REACT_APP_API}/admin/location/add/${isAuthenticated()?.admin._id}`,
            data:location,
            headers:{
                Authorization:`Bearer ${isAuthenticated().token}`
            }
        }).then((res) => {
            if(res.status===200){
                makeToast("success", res?.data?.location+" added Successfully");
                setLocation({});
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
          <div className='form' >
              <label htmlFor='location'>Location <span style={{color:'red'}}>*</span></label>
              <Autocomplete
                className='form-input'
                apiKey="AIzaSyATzOQBhRyutho2AlgGTQnsybhNOkuACzI"
                onPlaceSelected={(place) => {
                    setLocation({
                        name:place?.formatted_address,
                        lat:place?.geometry?.location?.lat(),
                        lng:place?.geometry?.location?.lng()
                    })
                }}
                />
              {/* <input name='location' id='location' className='form-input' value={location} onChange={(e) => setLocation(e.target.value)} placeholder='Enter Location' /> */}
              <button className='submit' onClick={submitHandler} disabled={loading}>{loading ? "ADDING":"ADD LOCATION"}</button>
          </div>
      </div>
  </div>);
}

export default LocationForm;
