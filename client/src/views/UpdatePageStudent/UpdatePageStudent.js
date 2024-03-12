import React, { useState, useEffect } from "react";
import "./UpdatePageStudent.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";



const UpdatePageStudent = (props) => {
  const { id } = useParams();
  const [loaded, setLoaded] = useState(false); 
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    fieldOfStudy: "",
    levelStudent: "",
    password: "",
    confirmPassword: "",
  });
  const [confirmReg, setConfirmReg] = useState("");
  const [errs, setErrs] = useState({});

  //get  data one specific student
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/students/" + id, {
        withCredentials: true,
      })
      .then((res) => {
        console.log("u++++++++++", res.data.oneSingleStudent);
        setUser({
          name: res.data.oneSingleStudent.name,
          email: res.data.oneSingleStudent.email,
          fieldOfStudy: res.data.oneSingleStudent.fieldOfStudy,
          levelStudent: res.data.oneSingleStudent.levelStudent,
          password: "default",
          confirmPassword: "default",
        });
        setLoaded(true); 
        // console.log("k++++++++++",user.name);
      })
      .catch((err) => console.log(err));
  }, [id]); 

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value, 
    });
  };

  const updateStudent = (e) => {
    e.preventDefault();
    axios
      .patch("http://localhost:8000/api/students/" + id, user, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data);
        setUser({
          name: "",
          email: "",
          fieldOfStudy: "",
          levelStudent: "",
          password: "",
          confirmPassword: "",
        });
        setConfirmReg("Thank you for registering, you can now log in");
        setErrs({});
        navigate("/admin-dashboard");
      })
      .catch((err) => {
        console.log(err);
        setErrs(err.response.data.errors.errors);
        console.log("+++++++++", err.response.data.errors.errors);
      });
  };


  // show/hiden value input password
  const toggleInputType = (ev) =>{
    ev.target.classList.toggle('fa-eye-slash');
    ev.target.classList.toggle('fa-eye');
    const input = ev.target.parentNode.children[0];
  //  console.log(input);
    input.type === "password" ? input.type = "text" : input.type = "password";
  }

  return (
    <div className="UpdatePageStudent">
      <div className="page-top">
        <h2>update Student</h2>
        <Link to="/admin-dashboard">
          <ion-icon name="arrow-back-circle-outline"></ion-icon>back to Home
        </Link>
      </div>

      {confirmReg ? <h1 style={{ color: "grey" }}>{confirmReg}</h1> : null}

      {loaded === true ? (
        <form onSubmit={updateStudent}>
          <div className="field">
            <label>name</label>
            {errs.name ? (
              <span className="error-text">{errs.name.message}</span>
            ) : null}
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="field">
            <label>Email</label>
            {errs.email ? (
              <span className="error-text">{errs.email.message}</span>
            ) : null}
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="field">
            <label>field Of Study</label>
            {errs.fieldOfStudy ? (
              <span className="error-text">{errs.fieldOfStudy.message}</span>
            ) : null}
            <select
              name="fieldOfStudy"
              id=""
              value={user.fieldOfStudy}
              onChange={(e) => handleChange(e)}
            >
              <option value="Web developement">Web developement</option>
              <option value="data analyst">data analyst</option>
              <option value="ux design">ux design</option>
            </select>
          </div>
          <div className="field">
            <label>level Student</label>
            {errs.levelStudent ? (
              <span className="error-text">{errs.levelStudent.message}</span>
            ) : null}
            <input
              type="number"
              name="levelStudent"
              value={user.levelStudent}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="field">
            <label>Password</label>
            {errs.password ? (
              <span className="error-text">{errs.password.message}</span>
            ) : null}
            <div className="input-icon relative">
              <input
                type="text"
                name="password"
                value={user.password}
                onChange={(e) => handleChange(e)}
              />
              <i onClick={(ev)=> toggleInputType(ev)} className="fas fa-eye  absolute"></i>
            </div>
            <span className="infos-pwd">password must contain at least one lowercase letter, one uppercase letter, one number and one special character, and be at least 8 characters long</span>
          </div>
          <div className="field">
            <label>Confirm Password</label>
            {errs.confirmPassword ? (
              <span className="error-text">{errs.confirmPassword.message}</span>
            ) : null}
            <div className="input-icon relative">
              <input
                type="text"
                name="confirmPassword"
                value={user.confirmPassword}
                onChange={(e) => handleChange(e)}
              />
              <i onClick={(ev)=> toggleInputType(ev)} className="fas fa-eye  absolute"></i>
            </div>
          </div>
          <button type="submit">Update</button>
        </form>
      ) : null}
    </div>
  );
};

export default UpdatePageStudent;
