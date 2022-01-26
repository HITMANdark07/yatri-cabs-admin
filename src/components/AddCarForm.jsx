import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import "../App.css";
import { authenticate } from '../auth';

function AddCarForm() {

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
        button:'ADD'
    });
    const [categories, setCategories] = useState([]);
    const init =() => {
        axios({
        method:'GET',
        url:`${process.env.REACT_APP_API}/category-list`
        }).then((res) => {
        setCategories(res.data);
        }).catch((err) => {
        console.log(err);
        })
    }

    useEffect(() => {
        init();
    },[]);
    const {message, reg_number, type,permit_validity,insurance_validity, status,loading,button, redirect} = values;
    const signup = (event) => {
        event.preventDefault();
        setValues((state) => ({
            ...state,
            loading:true,
            button:'ADDING...',
        }))
        const data = {
            reg_number,
            type,
            permit_validity,
            insurance_validity
        }
        axios.post(`${process.env.REACT_APP_API}/admin/signin`,{
            ...data
        }).then((res) => {
            if(res?.data?.token){
                setValues((state) => ({
                    ...state,
                    reg_number:"",
                    type:"",
                    image:"",
                    permit_validity:"",
                    insurance_validity:"",
                    button:'ADD',
                    redirect:true,
                    loading:false,
                    message:`${res?.data?.admin?.name} is Successfully Registered`,
                    status:'success'
                }));
                authenticate(res?.data,() => {
                    console.log(res.data);
                })
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
              <h2 style={{textAlign:'left', marginLeft:'5%', fontWeight:'350', letterSpacing:'5px'}}>ADD CAR</h2>
              <label>Registration Number <span style={{color:'red'}}>*</span></label>
              <input onChange={onchangeHandler} name="reg_number" value={reg_number} className='form-input' type="text" placeholder='Enter Vehical Registration Number' required />
              <label>Select Car Type <span style={{color:'red'}}>*</span></label>
              <select className="form-select">
                  {
                    categories.map((cat) => (
                        <option value={cat._id} key={cat._id}>{cat.title}</option>
                    ))
                  }
              </select>
              <label className='upload-image' htmlFor='car-image'>Upload Car Image <span style={{color:'red'}}>*</span></label>
              <input id="car-image" style={{display:'none'}} type="file" accept="image/*" className='form-input' />
              <label>Permit Validity <span style={{color:'red'}}>*</span></label>
              <input onChange={onchangeHandler} name="permit_validity" value={permit_validity} className='form-input' type="date" placeholder='Permit Validity' required />
              <label>Permit Validity <span style={{color:'red'}}>*</span></label>
              <input onChange={onchangeHandler} name="insurance_validity" value={insurance_validity} className='form-input' type="date" placeholder='Insurance Validity' required />
              {showMessage()}
              <button className='submit' type='submit' disabled={loading}>{button}</button>
          </form>
      </div>
  </div>;
}

export default AddCarForm;
