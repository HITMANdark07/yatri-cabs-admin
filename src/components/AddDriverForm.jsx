import axios from 'axios';
import React, { useState } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import "../App.css";
import { isAuthenticated } from '../auth';

function AddCategoryForm() {
    const [locations, setLocations] = useState([]);
    const [values, setValues] = useState({
        name:"",
        phone:"",
        password:"",
        aadhar_number:"",
        image:"",
        location:"",
        dl_number:"",
        message:'SUCCESS',
        loading:false,
        redirect:false,
        status:"",
        button:'ADD'
    });
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
    React.useEffect(() => {
        getLocs();
    },[])
    const {message, name, phone,aadhar_number,dl_number,location,password,image, status,loading,showImage,button, redirect} = values;
    const signup = (event) => {
        event.preventDefault();
        setValues((state) => ({
            ...state,
            loading:true,
            button:'ADDING...',
        }))
        
        // console.log(data);

        axios({
            method:'POST',
            url:`${process.env.REACT_APP_API}/admin/driver/register/${isAuthenticated()?.admin?._id}`,
            data:{
                name:name,
                phone:phone,
                password:password,
                aadhar_number:aadhar_number,
                dl_number:dl_number,
                image:image
            },
            headers:{
                Authorization:`Bearer ${isAuthenticated()?.token}`
            }
        }).then((res) => {
            if(res?.data){
                setValues((state) => ({
                    ...state,
                    name:"",
                    phone:"",
                    password:"",
                    aadhar_number:"",
                    dl_number:"",
                    image:"",
                    button:'ADD',
                    redirect:true,
                    loading:false,
                    message:`${res?.data?.name} is Successfully Registered`,
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
                <Redirect to="/" />
            )
        }
    }
    
  return <div className='App'>
      <div className='form-container'>
          {Redirecting()}
          <form className='form' onSubmit={signup}>
              <h2 style={{textAlign:'left', marginLeft:'5%', fontWeight:'350', letterSpacing:'5px'}}>ADD DRIVER</h2>
              <label>Driver Name <span style={{color:'red'}}>*</span></label>
              <input onChange={onchangeHandler} name="name" value={name} className='form-input' type="text" placeholder='Enter Driver Name' required />
              <label>Select Location <span style={{color:'red'}}>*</span></label>
              <select value={location} onChange={(e) => {
                  setValues((state) =>({
                      ...state,
                      location:e.target.value
                  }));
              }} className="form-select">
                  {
                    locations.map((loc) => (
                        <option value={loc._id}>{loc.location}</option>
                    ))
                  }
                  {/* <option value="prime">Prime</option>
                  <option value="standard">Standard</option> */}
              </select>
              <label className='upload-image' style={{marginLeft:'3%'}} htmlFor='car-image'>Upload Driver Photo <span style={{color:'red'}}>*</span></label>
              <input id="car-image" style={{display:'none'}} type="file" onChange={(e) => {
                //   setValues((state) => ({
                //       ...state,
                //       photo:e.target.files[0],
                //       showImage:URL.createObjectURL(e.target.files[0])
                //   }))
              }} accept="image/*" className='form-input' />
              {
                  showImage && (
                      <img style={{marginLeft:'5%'}} src={showImage} alt="show-ig" width="250px" />
                  )
              }
              {/* <label>AC Availability <span style={{color:'red'}}>*</span></label>
              <label className='switch' style={{marginLeft:'5%'}}  htmlFor='ac'>
              <input id="ac" type="checkbox" onChange={(e) => {
                  setValues((state) => ({
                      ...state,
                      ac:e.target.checked
                  }))
              }}  className='form-input'  />
              <span className="slider round"></span>
              </label> */}
              <label>Password <span style={{color:'red'}}>*</span></label>
              <input onChange={onchangeHandler} name="password" value={password} className='form-input' type="password" placeholder='Password' required />
              <label>Driving Licence Number <span style={{color:'red'}}>*</span></label>
              <input onChange={onchangeHandler} name="dl_number" value={dl_number} className='form-input' type="text" placeholder='Enter Driving Licence Number' required />
              <label>Aadhar Number <span style={{color:'red'}}>*</span></label>
              <input onChange={onchangeHandler} name="aadhar_number" value={aadhar_number} className='form-input' type="text" placeholder='Enter Aadhar Card Number' required />
              {showMessage()}
              <button className='submit' type='submit' disabled={loading}>{button}</button>
          </form>
      </div>
  </div>;
}

export default withRouter(AddCategoryForm);
