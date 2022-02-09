import axios from 'axios';
import React, { useState } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import "../App.css";
import { isAuthenticated } from '../auth';
import makeToast from '../Toaster';

function UpdateDriverForm({driverId}) {
    const [locations, setLocations] = useState([]);
    const [values, setValues] = useState({
        name:"",
        phone:"",
        password:"",
        aadhar_number:"",
        image:"",
        location:"",
        showImage:"",
        dl_number:"",
        username:"",
        message:'SUCCESS',
        loading:false,
        redirect:false,
        status:"",
        button:'UPDATE'
    });
    const getLocs =() => {
        axios({
            method:"GET",
            url:`${process.env.REACT_APP_API}/location/list`,
        }).then((res) => {
            setLocations(res.data);
            // setValues((state) => ({
            //     ...state,
            //     location:res?.data[0]?._id
            // }))
        }).catch((err) => {
            console.log(err.response?.data?.error);
            alert("SOMETHING WENT WRONG");
        })
    };

    const getDriver = React.useCallback(() => {
        axios({
            method:'GET',
            url:`${process.env.REACT_APP_API}/driver/detail/${driverId}`,
        }).then((res) => {
            console.log(res.data);
            let d = res.data;
            setValues((state) => ({
                ...state,
                location:d.location,
                name:d.name,
                phone:d.phone,
                image:d.image,
                aadhar_number:d.aadhar_number,
                dl_number:d.dl_number,
                username:d.username,
                showImage:`${process.env.REACT_APP_API}/image/photo/${d.image}`
            }))
        }).catch((err) => {
            console.log(err);
            alert("SOMETHING WENT WRONG");
        })
    },[driverId])
    React.useEffect(() => {
        getLocs();
        getDriver();
    },[getDriver])
    const {message, name, phone,aadhar_number,dl_number,location,username,password,image, status,loading,showImage,button, redirect} = values;
    const signup = (event) => {
        event.preventDefault();
        setValues((state) => ({
            ...state,
            loading:true,
            button:'UPDATING...',
        }))
        const data ={
            name:name,
            phone:phone,
            location:location,
            username:username,
            password:password,
            aadhar_number:aadhar_number,
            dl_number:dl_number,
            image:image
        }
        if(password===""){
            delete data.password;
        }

        axios({
            method:'PUT',
            url:`${process.env.REACT_APP_API}/driver/update/${driverId}/${isAuthenticated()?.admin?._id}`,
            data:data,
            headers:{
                Authorization:`Bearer ${isAuthenticated()?.token}`
            }
        }).then((res) => {
            console.log(res.data);
            if(res?.data){
                setValues((state) => ({
                    ...state,
                    name:"",
                    phone:"",
                    password:"",
                    aadhar_number:"",
                    username:"",
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
                <Redirect to="/driver" />
            )
        }
    }
    
  return <div className='App'>
      <div className='form-container'>
          {Redirecting()}
          <form className='form' onSubmit={signup}>
              <h2 style={{textAlign:'left', marginLeft:'5%', fontWeight:'350', letterSpacing:'5px'}}>UPDATE DRIVER</h2>
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
                  {/* <option value="prime">Prime</option>
                  <option value="standard">Standard</option> */}
              </select>
              <label>Driver Name <span style={{color:'red'}}>*</span></label>
              <input onChange={onchangeHandler} name="name" value={name} className='form-input' type="text" placeholder='Enter Driver Name' required />
              
              <label>Driver Phone <span style={{color:'red'}}>*</span></label>
              <input onChange={onchangeHandler} name="phone" value={phone} className='form-input' type="text" placeholder='Enter Driver Phone Number' required />
              
              <label className='upload-image' style={{marginLeft:'3%'}} htmlFor='car-image'>Upload Driver Photo <span style={{color:'red'}}>*</span></label>
              <input id="car-image" style={{display:'none'}} type="file" onChange={(e) => {
                  const formData = new FormData();
                  formData.set('photo',e.target.files[0]);
                  axios({
                      method:'POST',
                      url:`${process.env.REACT_APP_API}/image/upload`,
                      data:formData
                  }).then((res) => {
                      if(res?.data?.id){
                        makeToast("success",res.data.message);
                        setValues((state) => ({
                            ...state,
                            image:res.data.id,
                            showImage:`${process.env.REACT_APP_API}/image/photo/${res.data.id}`
                        }))
                      }
                      console.log(res.data);
                  }).catch((err) => {
                      makeToast("error", err.response.data.error);
                  })
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
              <label>Enter Username <span style={{color:'red'}}>*</span></label>
              <input onChange={onchangeHandler} name="username" value={username} className='form-input' type="text" placeholder='Enter Username' required />
              
              
              {/* <label>New Password </label>
              <input onChange={onchangeHandler} name="password" value={password} className='form-input' type="password" placeholder='Password' />
               */}
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

export default withRouter(UpdateDriverForm);
