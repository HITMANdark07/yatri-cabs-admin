import axios from 'axios';
import moment from 'moment';
import React, { useState, useEffect, useCallback } from 'react';
import { Redirect } from 'react-router-dom';
import "../App.css";
import { isAuthenticated } from '../auth';

function UpdateCarForm({carId}) {

    const [values, setValues] = useState({
        reg_number:"",
        type:"",
        image:"",
        permit_validity:"",
        insurance_validity:"",
        message:'SUCCESS',
        loading:false,
        redirect:false,
        status:"",
        button:'UPDATE'
    });
    const [categories, setCategories] = useState([]);
    const init = useCallback(() => {
        axios({
        method:'GET',
        url:`${process.env.REACT_APP_API}/category-list`
        }).then((res) => {
        setCategories(res.data);
        setValues((state) => ({
            ...state,
        }));
        }).catch((err) => {
        console.log(err);
        })
    },[])
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
                    permit_validity:moment(res.data?.permit_validity).format('YYYY-MM-DD'),
                    insurance_validity:moment(res.data?.insurance_validity).format('YYYY-MM-DD'),
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
        getCarDetails();
    },[init, getCarDetails]);
    const {message, reg_number, type,permit_validity,image,insurance_validity, status,loading,button, redirect} = values;
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
            permit_validity,
            insurance_validity
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
              <h2 style={{textAlign:'left', marginLeft:'5%', fontWeight:'350', letterSpacing:'5px'}}>ADD CAR</h2>
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
              <label>Permit Validity <span style={{color:'red'}}>*</span></label>
              <input onChange={onchangeHandler} name="permit_validity" value={permit_validity} style={{width:'95%', alignSelf:'center'}} className='form-input' type="date" placeholder='Permit Validity' required />
              <label>Insurance Validity <span style={{color:'red'}}>*</span></label>
              <input onChange={onchangeHandler} name="insurance_validity" value={insurance_validity} style={{width:'95%', alignSelf:'center'}} className='form-input' type="date" placeholder='Insurance Validity' required />
              {showMessage()}
              <button className='submit' type='submit' disabled={loading}>{button}</button>
          </form>
      </div>
  </div>;
}

export default UpdateCarForm;
