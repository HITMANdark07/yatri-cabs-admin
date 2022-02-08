import React from 'react';
import axios from 'axios';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { isAuthenticated } from '../auth';
import { Switch } from '@mui/material';
import makeToast from '../Toaster';

function LocationList({location}) {
    const [status, setStatus] = React.useState(location.status);

  const updateStatus = () => {
      axios({
          method:'PUT',
          url:`${process.env.REACT_APP_API}/admin/location/update/${location._id}/${isAuthenticated()?.admin?._id}`,
          data:{
            status:!status
          },
          headers:{
            Authorization:`Bearer ${isAuthenticated()?.token}`
          }
      }).then((res) => {
          setStatus(res.data.status);
          makeToast("success", res.data.name+" updated");
      }).catch((err) => {
          makeToast("error",err.response.data.error);
      })
  }
  return (<div className="location-box">
            <LocationOnIcon />
            <div className="location-font">{location.name}</div>
            <Switch checked={status} onClick={updateStatus} />
        </div>);
}

export default LocationList;
