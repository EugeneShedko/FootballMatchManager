import React, { useState } from "react"
import ReactDOM from 'react-dom/client';
import "./css/mainpage.css"
import Header from "./components/mainpage/header"
import Content from "./components/mainpage/content"

export default function App() {

  return (
    <div id="main-containter" className="container-fluid p-0 m-0 vh-100 vw-100">
      <div id="back-container" />
      <Header />
      <Content/>
    </div>

  );
}
