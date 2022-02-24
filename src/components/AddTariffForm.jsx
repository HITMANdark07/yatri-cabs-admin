import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import "../App.css";
import { isAuthenticated } from '../auth';
// import Autocomplete from "react-google-autocomplete";

function AddTariffForm() {

    const [values, setValues] = useState({
        trip_type:"LOCAL",
        sub_trip_type:"8HRS/80KM",
        category:"",
        location:"",
        min_fare:"",
        extra_km:"",
        per_km:"",
        extra_hours:"",
        driver_allowance:"",
        driver_allowance_day:"",
        min_km_per_day:"",
        gst:"",
        message:'SUCCESS',
        loading:false,
        redirect:false,
        status:"",
        button:'ADD'
    });

    const [locations, setLocations] = useState([]);
    const [categories, setCategories] = useState([]);
    const init =() => {
        axios({
        method:'GET',
        url:`${process.env.REACT_APP_API}/category-list`
        }).then((res) => {
        setCategories(res.data);
        setValues((state) => ({
            ...state,
            category:res.data[0]._id
        }));
        }).catch((err) => {
        console.log(err);
        })
    }

    const getLocs =() => {
        axios({
            method:"GET",
            url:`${process.env.REACT_APP_API}/location/list`,
        }).then((res) => {
            setLocations(res.data);
            setValues((state) => ({
                ...state,
                location:res?.data[0]?._id
            }))
        }).catch((err) => {
            console.log(err.response?.data?.error);
            alert("SOMETHING WENT WRONG");
        })
    };

    useEffect(() => {
        init();
        getLocs();
    },[]);
    const {message, location,category,min_km_per_day,per_km, trip_type,driver_allowance_day, sub_trip_type,min_fare,extra_km,extra_hours,driver_allowance,gst, status,loading,button, redirect} = values;
    const signup = (event) => {
        event.preventDefault();
        setValues((state) => ({
            ...state,
            loading:true,
            button:'ADDING...',
        }))
        const data = {
            category,
            location,
            min_fare,
            trip_type,
            sub_trip_type,
            per_km,
            min_km_per_day,
            driver_allowance_day,
            extra_hours,
            extra_km,
            driver_allowance,
            gst,
        }
        console.log(data);
        axios.post(`${process.env.REACT_APP_API}/admin/tariff/add/${isAuthenticated()?.admin?._id}`,{
            ...data
        },{
            headers:{
                Authorization: `Bearer ${isAuthenticated()?.token}`
            }
        }).then((res) => {
            if(res?.data?._id){
                setValues((state) => ({
                    ...state,
                    redirect:true,
                    loading:false,
                    message:`${res?.data?.admin?.name} is Successfully Registered`,
                    status:'success'
                }));
            }
        }).catch((err) => {
            setValues((state) => ({
                ...state,
                loading:false,
                button:'ADD',
                status:"warning",
                message:err?.response?.data?.error
            }))
        })
    }
    const hide = () => {
        setValues((state) => ({
            ...state,
            status:""
        }))
    } 
    const showMessage = () =>{
        if(status!==""){
            if(status==="success"){
                return (
                    <div className='success'>
                        <div>
                        {message}
                        </div>
                        <div onClick={hide} className='cross'>❌</div>
                    </div>
                )
            }
            if(status==="warning"){
                return(
                    <div className='warning'>
                        <div>
                        {message}
                        </div>
                        <div onClick={hide} className='cross'>❌</div>
                    </div>
                )
            }
            if(status==="error"){
                return (
                    <div className='error'>
                    <div>
                        {message}
                        </div>
                        <div onClick={hide} className='cross'>❌</div>
                    </div>
                )
            }else{
                return null;
            }
        }
        return null;
    }
    const onchangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setValues((state) => ({
            ...state,
            [name]:value
        }))
    }
    const Redirecting =() => {
        if(redirect){
            return (
                <Redirect to="/tariff" />
            )
        }
    }
  return <div className='App'>
      <div className='form-container'>
          {Redirecting()}
          <form className='form' onSubmit={signup}>
              <h2 style={{textAlign:'left', marginLeft:'5%', fontWeight:'350', letterSpacing:'5px'}}>ADD TARIFF</h2>
              <label>Select Location <span style={{color:'red'}}>*</span></label>
              <select value={location} onChange={(e) => {
                  setValues((state) =>({
                      ...state,
                      location:e.target.value
                  }));
              }} className="form-select">
                  {
                    locations.map((loc) => (
                        <option key={loc._id} value={loc._id}>{loc.name}</option>
                    ))
                  }
              </select>
              <label>Select Car Type <span style={{color:'red'}}>*</span></label>
              <select onChange={(e) => {
                  setValues((state) => ({
                      ...state,
                      category:e.target.value

                  }))
              }} value={category} className="form-select">
                  {
                    categories.map((cat) => (
                        <option value={cat._id} key={cat._id}>{cat.title}</option>
                    ))
                  }
              </select>

              <label>Select Trip Type <span style={{color:'red'}}>*</span></label>
              <select onChange={(e) => {
                  let sub="8HRS/80KM"
                  if(e.target.value==="LOCAL") sub="8HRS/80KM";
                  if(e.target.value==="OUTSTATION") sub="ONEWAY";
                  if(e.target.value==="AIRPORT") sub="CAB_FROM_AIRPORT";
                  setValues((state) => ({
                      ...state,
                      per_km:e.target.value!=="OUTSTATION" ? "" : state.per_km,
                      extra_hours:e.target.value!=="LOCAL" ? "": state.extra_hours,
                      min_fare: e.target.value==="OUTSTATION" ? "" : state.min_fare,
                      trip_type:e.target.value,
                      sub_trip_type:sub
                  }))
              }} value={trip_type} className="form-select">
                        <option value="LOCAL">LOCAL</option>
                        <option value="OUTSTATION">OUTSTATION</option>
                        <option value="AIRPORT">AIR TRANSPORT</option>
              </select>

              {trip_type!=="" && 
              <>
              <label>Select Sub-Trip Type <span style={{color:'red'}}>*</span></label>
              <select onChange={(e) => {
                  setValues((state) => ({
                      ...state,
                      sub_trip_type:e.target.value
                  }))
              }} value={sub_trip_type} className="form-select">
                        {
                          trip_type==="LOCAL" &&
                          <>
                          <option value="8HRS/80KM">8HRS/80KM</option>
                          <option value="12HRS/120KM">12HRS/120KM</option>
                          </>
                        }
                        { 
                        trip_type==="OUTSTATION" && 
                        <>
                        <option value="ONEWAY">ONEWAY</option>
                        <option value="ROUND_TRIP">ROUND TRIP</option>
                        </>
                        }
                        {
                          trip_type==="AIRPORT" && 
                          <>
                          <option value="CAB_FROM_AIRPORT">CAB FROM AIRPORT</option>
                          <option value="CAB_TO_AIRPORT">CAB TO AIRPORT</option>
                          </>
                        }
              </select>
              </>}
              
              {
                  trip_type!=="OUTSTATION" ?
                  <>
                  <label>Base Fare <span style={{color:'red'}}>*</span></label>
                  <input onChange={onchangeHandler} name="min_fare" value={min_fare} className='form-input' type="number" placeholder='Enter Base Fare' />
                  <label>Extra KM Charge </label>
                  <input onChange={onchangeHandler} name="extra_km" value={extra_km} className='form-input' type="number" placeholder='Enter Extra KM Charge' />
                  </>
                  :
                  <>
                  <label>Per KM Charge <span style={{color:'red'}}>*</span></label>
                  <input onChange={onchangeHandler} name="per_km" value={per_km} className='form-input' type="number" placeholder='Per KM Charge' />
                  </>
              }
              
              
              {
                  trip_type==="LOCAL" &&
                  <>
                  <label>Extra Hours Charge </label>
                  <input onChange={onchangeHandler} name="extra_hours" value={extra_hours} className='form-input' type="number" placeholder='Enter Extra Hours Charge' />
                  </>
              }
                
              {
                  sub_trip_type==="ROUND_TRIP" &&
                  <>
                  <label>Minimun KM Per Day </label>
                  <input onChange={onchangeHandler} name="min_km_per_day" value={min_km_per_day} className='form-input' type="number" placeholder='Minimun KM Per Day' />
                  <label>Driver Day Allowance </label>
                  <input onChange={onchangeHandler} name="driver_allowance_day" value={driver_allowance_day} className='form-input' type="number" placeholder='Enter Driver Per Day Allowance' />
                  </>

              }
              
              
              <label>Driver Night Allowance </label>
              <input onChange={onchangeHandler} name="driver_allowance" value={driver_allowance} className='form-input' type="number" placeholder='Enter Driver Night Allowance' />
              
              <label>Enter GST <span style={{color:'red'}}>*</span></label>
              <input onChange={onchangeHandler} name="gst" value={gst} className='form-input' type="number" placeholder='Enter GST Charge' />
              
              {/* <input onChange={onchangeHandler} name="insurance_validity" value={insurance_validity} style={{width:'95%', alignSelf:'center'}} className='form-input' type="date" placeholder='Insurance Validity' required /> */}
              {showMessage()}
              <button className='submit' type='submit' disabled={loading}>{button}</button>
          </form>
      </div>
  </div>;
}

export default AddTariffForm;
