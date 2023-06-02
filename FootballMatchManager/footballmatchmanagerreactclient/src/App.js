import React from "react";
import "./css/mainpage.css";
import Header from "./Pages/Header";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./addtionalcomponents/AppRouter";

export default function App() 
{
  return (
    <div id="main-containter" className="container-fluid p-0 m-0 vh-100">
    <div id="back-container" />
    <BrowserRouter>
        {/* Возможно убрать от сюда заголовок и перенести его в какое-то другое место */}
        <Header/>
        <AppRouter/>
    </BrowserRouter>
  </div>
  );
}