import React, { useEffect, useState } from "react";
import axios from "axios";
import './UpdatePageInstructorPassword.css';


const UpdatePageInstructorPassword = (props)=>{
    const userObjs = JSON.parse(localStorage.getItem("USER_OBJ")) || {};
    const id = userObjs._id

    const [confirmReg, setConfirmReg] = useState("");
    const [errs2, setErrs2] = useState('');
    const [loaded, setLoaded] = useState(false); 
    const [user, setUser] = useState({
      id: id,
      name: "",
      email: "",
      isInstructor: "false",
      password: "",
      confirmPassword:""
    });
   
  
    const handleChange = (e)=>{
      setUser({
        ...user,
        [e.target.name]: e.target.value 
      })
    }
    

  //  get  data one specific instructor
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/instructors/" + id,{withCredentials: true})
      .then((res) => {
        console.log("u++++++++++",res.data.oneSingleInstructor);
        setUser({
           id: id,
           name: res.data.oneSingleInstructor.name,
           email: res.data.oneSingleInstructor.email,
           isInstructor: res.data.oneSingleInstructor.isInstructor,
          password: "default",
          confirmPassword: "default"
        });
        setLoaded(true); 
      })
      .catch((err) => console.log(err));
      
    }, [id]); 


    const updateInstructor = (e) =>{
      e.preventDefault();
      axios.patch('http://localhost:8000/api/instructors/password/'+ id,
      user,
      {
        withCredentials: true,
      })
      .then(res =>{
        console.log(res.data);
        setUser({
          ...user, 
          password: "", 
          confirmPassword: "" 
        });
        setErrs2("");
        setConfirmReg("succefully, change your password!!!");
      })
      .catch((err)=>{
        console.log(err);
        setErrs2(err.response.data.message);
        console.log("+++++++++",err.response.data.message);
      })
    };

   

  // show/hiden value input password
  const toggleInputType = (ev) =>{
    ev.target.classList.toggle('fa-eye-slash');
    ev.target.classList.toggle('fa-eye');
    const input = ev.target.parentNode.children[0];
  //  console.log(input);
    input.type === "password" ? input.type = "text" : input.type = "password";
  }

  
   
  return(
    <div className="UpdatePageInstructorPassword">
      {
        confirmReg?
        <h2 style={{color: "grey", paddingLeft:"17px"}}>{confirmReg}</h2>
        :null
      }
      {
        errs2?
        <span className="error-text">{errs2}</span>
        :null
      }
      {loaded === true ? 
      <form onSubmit={updateInstructor}>
        <div className="field">
          <label>Password</label>
          <div className="input-icon relative">
            <input type="text" name="password" value={user.password} onChange={(e)=> handleChange(e)}/>
            <i onClick={(ev)=> toggleInputType(ev)} className="fas fa-eye  absolute"></i>
          </div>
          <span className="infos-pwd">password must contain at least one lowercase letter, one uppercase letter, one number and one special character, and be at least 8 characters long</span>
        </div>
        <div className="field">
          <label>Confirm Password</label>
          <div className="input-icon relative">
            <input type="text" name="confirmPassword" value={user.confirmPassword} onChange={(e)=> handleChange(e)}/>
            <i onClick={(ev)=> toggleInputType(ev)} className="fas fa-eye  absolute"></i>
          </div>
        </div>
        <button type="submit">Update</button>
      </form>  : null }
    </div>
  );
  };
  
  export default UpdatePageInstructorPassword;

