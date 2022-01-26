import axios from 'axios';
import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import "../App.css";
import { authenticate } from '../auth';

function CarCategoryForm() {

    const [values, setValues] = useState({
        email:"",
        password:"",
        message:'SUCCESS',
        loading:false,
        redirect:false,
        status:"",
        button:'SIGN IN'
    });
    const {message, email, password, status,loading,button, redirect} = values;
    const signup = (event) => {
        event.preventDefault();
        setValues((state) => ({
            ...state,
            loading:true,
            button:'SIGNING IN...',
        }))
        const data = {
            email,
            password
        }
        axios.post(`${process.env.REACT_APP_API}/admin/signin`,{
            ...data
        }).then((res) => {
            if(res?.data?.token){
                setValues((state) => ({
                    ...state,
                    name:"",
                    email:"",
                    button:'SIGN IN',
                    password:"",
                    confirm:"",
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
                button:'SIGN IN',
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
              <label>Email <span style={{color:'red'}}>*</span></label>
              <input onChange={onchangeHandler} name="email" value={email} className='form-input' type="email" placeholder='Enter your Email' required />
              <label>Password <span style={{color:'red'}}>*</span></label>
              <input onChange={onchangeHandler} name="password" value={password} className='form-input' type="password" placeholder='Type Password' required />
              {showMessage()}
              <button className='submit' type='submit' disabled={loading}>{button}</button>
          </form>
      </div>
  </div>;
}

export default CarCategoryForm;
