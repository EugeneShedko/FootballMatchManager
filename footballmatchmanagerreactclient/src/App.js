import React, { useState } from "react";
import "./css/mainpage.css";
import Header from "./pagescomponents/header";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./addtionalcomponents/AppRouter";

export default function App() 
{
  return (
    <div id="main-containter" className="container-fluid p-0 m-0 vh-100 vw-100">
    <div id="back-container" />
    <BrowserRouter>
        <Header/>
        <AppRouter/>
    </BrowserRouter>
  </div>
  );
}