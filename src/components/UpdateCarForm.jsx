import axios from 'axios';
import moment from 'moment';
import React, { useState, useEffect, useCallback } from 'react';
import { Redirect } from 'react-router-dom';
import "../App.css";
import { isAuthenticated } from '../auth';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import { TextField } from '@mui/material';
import Stack from '@mui/material/Stack';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

function UpdateCarForm({carId}) {

    const [values, setValues] = useState({
        reg_number:"",
        type:"",
        image:"",
        location:"",
        make_model:"",
        permit_validity_from:new Date(),
        permit_validity_to:new Date(),
        insurance_validity_from:new Date(),
        insurance_validity_to:new Date(),
        message:'SUCCESS',
        loading:false,
        redirect:false,
        status:"",
        button:'UPDATE'
    });
    const [locations, setLocations] = useState([]);
    const [categories, setCategories] = useState([]);
    const init = useCallback(() => {
        axios({
        method:'GET',
        url:`${process.env.REACT_APP_API}/category-list`
        }).then((res) => {
        setCategories(res.data);
        }).catch((err) => {
        console.log(err);
        })
    },[])
    const getLocs =() => {
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
    const getCarDetails = useCallback(() => {
        axios({
            method:'GET',
            url:`${process.env.REACT_APP_API}/car/details/${carId}`
        }).then((res) => {
            if(res?.data?._id){
                setValues((state) => ({
                    ...state,
                    reg_number:res.data.reg_number,
                    type:res.data?.type?._id,
                    make_model:res.data?.make_model,
                    location: res.data.location,
                    permit_validity_from:moment(res.data?.permit_validity_from).format('YYYY-MM-DD'),
                    permit_validity_to:moment(res.data?.permit_validity_to).format('YYYY-MM-DD'),
                    insurance_validity_from:moment(res.data?.insurance_validity_from).format('YYYY-MM-DD'),
                    insurance_validity_to:moment(res.data?.insurance_validity_to).format('YYYY-MM-DD'),
                    image:res.data?.image
                }))
            }
        }).catch((err) => {
            console.log(err.response.data.error);
            alert("SOMETHING WENT WRONG");
        })
    },[carId]);

    useEffect(() => {
        init();
        getLocs();
        getCarDetails();
    },[init, getCarDetails]);
    const {message, reg_number, type,permit_validity_from,permit_validity_to,location,image,insurance_validity_from,insurance_validity_to,make_model, status,loading,button, redirect} = values;
    const signup = (event) => {
        event.preventDefault();
        setValues((state) => ({
            ...state,
            loading:true,
            button:'UPDATING...',
        }))
        const data = {
            reg_number,
            type,
            image,
            location,
            make_model,
            permit_validity_from,
            permit_validity_to,
            insurance_validity_from,
            insurance_validity_to
        }
        console.log(data);
        axios.put(`${process.env.REACT_APP_API}/admin/car/update/${carId}/${isAuthenticated()?.admin?._id}`,{
            ...data
        },{
            headers:{
                Authorization: `Bearer ${isAuthenticated()?.token}`
            }
        }).then((res) => {
            if(res?.data?._id){
                setValues((state) => ({
                    ...state,
                    reg_number:"",
                    type:"",
                    image:"",
                    permit_validity:"",
                    insurance_validity:"",
                    button:'UPDATE',
                    redirect:true,
                    loading:false,
                    message:`${res?.data?.reg_number} is Successfully Updated`,
                    status:'success'
                }));
            }
        }).catch((err) => {
            setValues((state) => ({
                ...state,
                loading:false,
                button:'UPDATE',
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
                <Redirect to="/cars" />
            )
        }
    }
  return <div className='App'>
      <div className='form-container'>
          {Redirecting()}
          <form className='form' onSubmit={signup}>
              <h2 style={{textAlign:'left', marginLeft:'5%', fontWeight:'350', letterSpacing:'5px'}}>UPDATE CAR</h2>
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
              <label>Registration Number <span style={{color:'red'}}>*</span></label>
              <input onChange={onchangeHandler} name="reg_number" value={reg_number} className='form-input' type="text" placeholder='Enter Vehical Registration Number' required />
              <label>Select Car Type <span style={{color:'red'}}>*</span></label>
              <select onChange={(e) => {
                  setValues((state) => ({
                      ...state,
                      type:e.target.value
                  }))
              }} className="form-select">
                  {
                    categories.map((cat) => (
                        <option value={cat._id} key={cat._id}>{cat.title}</option>
                    ))
                  }
              </select>
              
              <label style={{marginLeft:'2%'}} className='upload-image' htmlFor='car-image'>Upload Car Image </label>
              <input id="car-image" style={{display:'none'}} type="file" accept="image/*" className='form-input' />

              <label>Make & Model <span style={{color:'red'}}>*</span></label>
              <input onChange={onchangeHandler} name="make_model" value={make_model} className='form-input' type="text" placeholder='Enter Make and Model' required />
              <br/>
              <div style={{width:'50%', marginLeft:'3%'}}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Stack spacing={3}>
              <DesktopDatePicker
                label="Permit Validity from"
                inputFormat="MM/dd/yyyy"
                value={permit_validity_from}
                onChange={(e) => {
                    if(e){
                        setValues((prevState) => ({
                            ...prevState,
                            permit_validity_from:e
                        }))
                    }
                }}
                renderInput={(params) => <TextField {...params} />}
                />
                <DesktopDatePicker
                label="Permit Validity to"
                inputFormat="MM/dd/yyyy"
                value={permit_validity_to}
                onChange={(e) => {
                    if(e){
                        setValues((prevState) => ({
                            ...prevState,
                            permit_validity_to:e
                        }))
                    }
                }}
                renderInput={(params) => <TextField {...params} />}
                />
                </Stack>
                </LocalizationProvider>
              </div>
              <br/>
              <div style={{width:'50%', marginLeft:'3%'}}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Stack spacing={3}>
              <DesktopDatePicker
                label="Insurance Validity from"
                inputFormat="MM/dd/yyyy"
                value={insurance_validity_from}
                onChange={(e) => {
                    if(e){
                        setValues((prevState) => ({
                            ...prevState,
                            insurance_validity_from:e
                        }))
                    }
                }}
                renderInput={(params) => <TextField {...params} />}
                />
                <DesktopDatePicker
                label="Insurance Validity to"
                inputFormat="MM/dd/yyyy"
                value={insurance_validity_to}
                onChange={(e) => {
                    if(e){
                        setValues((prevState) => ({
                            ...prevState,
                            insurance_validity_to:e
                        }))
                    }
                }}
                renderInput={(params) => <TextField {...params} />}
                />
                </Stack>
                </LocalizationProvider>
              </div>
                {showMessage()}
              <button className='submit' type='submit' disabled={loading}>{button}</button>
          </form>
      </div>
  </div>;
}

export default UpdateCarForm;
