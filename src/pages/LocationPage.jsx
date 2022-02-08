import React, { useState } from "react";
import Header from "../components/Header";
import LocationForm from "../components/LocationForm";
import axios from "axios";
import LocationList from "../components/LocationList";

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
                    <LocationList key={loc._id} location={loc} />
                ))
            }
        </div>
        </>
    )
};

export default LocationPage;