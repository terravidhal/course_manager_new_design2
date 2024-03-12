import React, { useEffect, useState } from 'react';
import './DetailsPageCourse.css';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';


const DetailsPageCourse = () => {

  const userObjs = JSON.parse(localStorage.getItem('USER_OBJ')) || {};
  const userObjsRole = userObjs.role || 'default';
  const userObjsId = userObjs._id || 'default';
  
  console.log("userObjRole+++++++++", userObjsRole);
  console.log("userObjsId+++++++++", userObjsId);



  const [OneCourse, setOneCourse] = useState({})
  const {id} = useParams(); 
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false); 

  
  useEffect(() => {
    axios.get("http://localhost:8000/api/courses/" + id,{withCredentials: true})
        .then( res => {
          console.log("u++++++++++",res.data.oneSingleCourse);
          setOneCourse(res.data.oneSingleCourse);
          setLoaded(true); 
          console.log("y++++++++++",OneCourse.students);
        })
        .catch( err => console.log(err) );
  }, [id]); 


 
  return(
    <div className="DetailsPageCourse">
      <div className="page-top">
        <h1>Details Courses</h1>
        {
            userObjsRole === 'admin' ? (
                <Link to="/admin-dashboard">
                    <ion-icon name="arrow-back-circle-outline"></ion-icon>back to Home
                </Link>
            ) : userObjsRole === 'student' ? (
                <Link to="/student-dashboard">
                    <ion-icon name="arrow-back-circle-outline"></ion-icon>back to Home
                </Link>
            ) : (
                <Link to="/instructor-dashboard">
                    <ion-icon name="arrow-back-circle-outline"></ion-icon>back to Home
                </Link>
            )
        }
      </div>   
      <div className="page-content">
        <div className="details-img">
          <img src="/assets/images/OIG1.jfif" alt="" />
        </div>
        <div className="fields">
            <p><span className='infos'>Level:</span>{OneCourse.level}</p>
            <p><span className='infos'>field:</span>{OneCourse.field}</p>
            <p><span className='infos'>description:</span> {OneCourse.description}</p>
            <p><span className='infos'>dayOfWeek:</span> {OneCourse.dayOfWeek}</p>
            <p><span className='infos'>type Of Course:</span> {OneCourse.typeOfCourse}</p>
            <p>
              <span className='infos'>link Meeting:</span>
              <a href={OneCourse.linkMeeting} target='_blank'>{OneCourse.linkMeeting}</a>
            </p>
            <p>
              <span className='infos'>documents Link:</span>
              <a href={OneCourse.documentsLink} target='_blank'>{OneCourse.documentsLink}</a>
            </p>
            <p><span className='infos'>start Time:</span> {OneCourse.startTime}</p>
            <p><span className='infos'>end Time:</span> {OneCourse.endTime}</p>
            <p><span className='infos'>duration:</span> {OneCourse.duration} minutes</p>
            <p><span className='infos'>status:</span> {OneCourse.status} minutes</p>
        </div>
      </div>
    </div>
  );
};


export default DetailsPageCourse;
