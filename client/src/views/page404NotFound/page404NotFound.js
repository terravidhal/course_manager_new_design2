import React from 'react';
import './page404NotFound.css';
import { Link, useNavigate } from "react-router-dom";


const Page404NotFound = () => {
  const navigate = useNavigate();

  const previous = () => {
    navigate(-1);
  }

  return (
    <div className="page404NotFound">
    <img src="/assets/images/main.png" alt=""/>
    <div className="wrapper">
        <h1>Page Not Found</h1>
       <p className="btn" onClick={previous}>Back to previous Page</p>
    </div>
    </div>
  );
};


export default Page404NotFound;
