import React, { useState } from "react";
import Header from "../components/Header";
import LocationForm from "../components/LocationForm";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from "axios";

const LocationPage  = () => {

    const [locations, setLocations] = useState([]);

    const init =() => {
        axios({
            method:"GET",
            url:`${process.env.REACT_APP_API}/location/list`,
        }).then((res) => {
            setLocations(res.data);
        }).catch((err) => {
            console.log(err.response?.data?.error);
            alert("SOMETHING WENT WRONG");
        })
    };

    React.useEffect(() => {
        init();
    },[]);

    return(
        <>
        <Header />
        <LocationForm getLocs={init} />
        <div className="location-container">
            {
                locations.map((loc) => (
                    <div key={loc._id} className="location-box">
                        <LocationOnIcon />
                        <div className="location-font">{loc.name}</div>
                    </div>
                ))
            }
        </div>
        </>
    )
};

export default LocationPage;