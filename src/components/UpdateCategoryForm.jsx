import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import "../App.css";
import { isAuthenticated } from '../auth';

function UpdateCategoryForm({categoryId}) {
    const [values, setValues] = useState({
        title:"",
        seats:"",
        photo:null,
        luggage:"",
        ac:false,
        showImage:null,
        message:'SUCCESS',
        loading:false,
        redirect:false,
        status:"",
        button:'UPDATE'
    });
    const {message, title,seats,photo,luggage,ac, status,loading,showImage,button, redirect} = values;

    const init = useCallback(() => {
        axios({
            method:'GET',
            url:`${process.env.REACT_APP_API}/category/${categoryId}`,
        }).then((res) => {
            if(res.status===200){
                const data = res.data;
                setValues((state) => ({
                    ...state,
                    title:data.title,
                    seats:data.seats,
                    luggage:data.luggage,
                    showImage:`${process.env.REACT_APP_API}/category/photo/${categoryId}`,
                    ac:data.ac
                }))
            }
        }).catch((error) => {
            console.log(error);
            alert("SOMETHING WENT WRONG");
        })
    },[categoryId]);

    useEffect(() => {
        init();
    },[init]);
    const signup = (event) => {
        event.preventDefault();
        setValues((state) => ({
            ...state,
            loading:true,
            button:'UPDATING...',
        }))
        
        const formData = new FormData();
        formData.set("title", title);
        if(photo){
            formData.set("photo", photo);
        }
        formData.set("ac",ac);
        formData.set("seats", seats);
        formData.set("luggage", luggage);
        // console.log(data);

        axios({
            method:'PUT',
            url:`${process.env.REACT_APP_API}/admin/category/update/${categoryId}/${isAuthenticated()?.admin?._id}`,
            data:formData,
            headers:{
                Authorization:`Bearer ${isAuthenticated()?.token}`
            }
        }).then((res) => {
            if(res?.data){
                setValues((state) => ({
                    ...state,
                    title:"",
                    seats:"",
                    photo:null,
                    luggage:"",
                    button:'UPDATE',
                    redirect:true,
                    loading:false,
                    message:`${res?.data?.title} is Successfully Added`,
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
                <Redirect to="/category" />
            )
        }
    }
  return <div className='App'>
      <div className='form-container'>
          {Redirecting()}
          <form className='form' onSubmit={signup}>
              <h2 style={{textAlign:'left', marginLeft:'5%', fontWeight:'350', letterSpacing:'5px'}}>UPDATE {title?.toUpperCase()} CATEGORY</h2>
              <label>Car Modal <span style={{color:'red'}}>*</span></label>
              <input onChange={onchangeHandler} name="title" value={title} className='form-input' type="text" placeholder='Enter Vehical Model' required />
              
              <label className='upload-image' style={{marginLeft:'3%'}} htmlFor='car-image'>Upload Car Image <span style={{color:'red'}}>*</span></label>
              <input id="car-image" style={{display:'none'}} type="file" onChange={(e) => {
                  setValues((state) => ({
                      ...state,
                      photo:e.target.files[0],
                      showImage:URL.createObjectURL(e.target.files[0])
                  }))
              }} accept="image/*" className='form-input' />
              {
                  showImage && (
                      <img style={{marginLeft:'5%'}} src={showImage} alt="show-ig" width="250px" />
                  )
              }
              <label>AC Availability <span style={{color:'red'}}>*</span></label>
              <label className='switch' style={{marginLeft:'5%'}}  htmlFor='ac'>
              <input id="ac" type="checkbox" checked={ac} onChange={(e) => {
                  setValues((state) => ({
                      ...state,
                      ac:e.target.checked
                  }))
              }}  className='form-input'  />
              <span className="slider round"></span>
              </label>
              <label>Seats <span style={{color:'red'}}>*</span></label>
              <input onChange={onchangeHandler} name="seats" value={seats} className='form-input' type="text" placeholder='Enter Seats' required />
              <label>Luggage <span style={{color:'red'}}>*</span></label>
              <input onChange={onchangeHandler} name="luggage" value={luggage} className='form-input' type="text" placeholder='Enter number of luggage' required />
              {showMessage()}
              <button className='submit' type='submit' disabled={loading}>{button}</button>
          </form>
      </div>
  </div>;
}

export default UpdateCategoryForm;
