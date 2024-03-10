import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import "./RegisterAdmin.css";


const RegisterAdmin = (props)=>{
    const [confirmReg, setConfirmReg] = useState("");
    const [errs, setErrs] = useState({});
    const [errs2, setErrs2] = useState("");
    const navigate = useNavigate();
  
    const [user, setUser] = useState({
      name: "",
      email: "",
      keyCode:"",
      password: "",
      confirmPassword:""
    })
  
    const handleChange = (e)=>{
      setUser({
        ...user,
        [e.target.name]: e.target.value 
      })
    }
  
    const register = e =>{
      e.preventDefault();
      axios.post('http://localhost:8000/api/registerAdmin',
      user,
      {
        withCredentials: true,
      })
      .then(res =>{
        console.log(res.data);
        setUser({
          name:"",
          email:"",
          keyCode:"",
          password:"",
          confirmPassword:""
        })
        setConfirmReg("Thank you for registering, you can now log in");
        setErrs({});
        navigate("/login_page");
      })
      .catch((err)=>{
        console.log(err);
       // setErrs(err.response.data.errors.errors);
        setErrs2(err.response.data.errors.message)
       // setErrs2(err.response.data.message)
       // console.log("+++++++++",err.response.data.message);
      })
  };

  // show/hiden value input password
  const toggleInputType = (ev) =>{
      ev.target.classList.toggle('fa-eye');
      const input = ev.target.parentNode.children[1];
    //  console.log(input);
      input.type === "password" ? input.type = "text" : input.type = "password";
  }
   
  
  return(
    <div  className="RegisterAdmin" style={{
      backgroundImage: 'url("/assets/images/bg_2.jpg.webp")',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      left: 0,
      top: 0,
      width: '100%',
      height: '100vh',
      position: 'relative',
      overflowY: 'auto',
    }}>
      <div className="page-top">
         <h2>Register admin</h2>
      </div>
      {
        confirmReg?
        <h1 style={{color: "grey"}}>{confirmReg}</h1>
        :null
      }
      <form onSubmit={register}>
        {
          errs2?
          <span className="error-text">{errs2}</span>
          :null
        }
        <div className="field">
          <label>name</label>
          {
            errs.name?
            <span className="error-text">{errs.name.message}</span>
            :null
          }
          <input type="text" name="name" value={user.name} onChange={(e)=> handleChange(e)}/>
        </div>
        <div className="field">
          <label>Email</label>
          {
            errs.email?
            <span className="error-text">{errs.email.message}</span>
            :null
          }
          <input type="email" name="email" value={user.email} onChange={(e)=> handleChange(e)}/>
        </div>
        <div className="field">
          <label>Key Code</label>
          <input type="password" name="keyCode" value={user.keyCode} onChange={(e)=> handleChange(e)}/>
        </div>
        <div className="field relative">
          <label>Password</label>
          {
            errs.password?
            <span className="error-text">{errs.password.message}</span>
            :null
          }
          <input type="password" name="password" value={user.password} onChange={(e)=> handleChange(e)}/>
          <i onClick={(ev)=> toggleInputType(ev)} className="fas fa-eye-slash  absolute"></i>
        </div>
        <div className="field relative">
          <label>Confirm Password</label>
          {
            errs.confirmPassword?
            <span className="error-text">{errs.confirmPassword.message}</span>
            :null
          }
          <input type="password" name="confirmPassword" value={user.confirmPassword} onChange={(e)=> handleChange(e)}/>
          <i onClick={(ev)=> toggleInputType(ev)} className="fas fa-eye-slash  absolute"></i>
        </div>
        <button type="submit">Register Me</button>
      </form>
    </div>
  );
  };
  
  export default RegisterAdmin;
