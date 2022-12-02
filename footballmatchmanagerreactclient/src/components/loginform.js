import React, { useState } from "react"
import ReactDOM from 'react-dom/client';
import "./../css/loginform.css"
import FRegistrationform from "./fregistrationform"
import UserProfile from "./userprofile/userprofile"
import App from "./../App"

export default function Loginform(props)
{
    const[loginContainerStyle, setLoginContainerStyle] = useState("col-3 logincontainer");

    function setRegistrationForm()
    {
        ReactDOM.createRoot(document.getElementById("form-container")).render(<FRegistrationform/>);
    }

    function closeLoginForm()
    {
        setLoginContainerStyle("col-3 logincontainerout");
        props.onClick(false);
        setTimeout(() => ReactDOM.createRoot(document.getElementById('root')).render(<App />), 500);
    }

    function execLogIn()
    {
        ReactDOM.createRoot(document.getElementById("body-content")).render(<UserProfile/>);
    }

    return(
        <div className={loginContainerStyle}>   
           <div className="row justify-content-end">
               <img id="closeicon" src="/image/closecross.png" alt="" onClick={closeLoginForm}/>
           </div>
            <div id="form-container" className="row">
            <div>
              <div className="loginheadtext">
                Войти
              </div>
              <div className="row justify-content-center input-container">
                 <input className="input-style" type="text" placeholder="Введите email"/>
              </div>
              <div className="row justify-content-center input-container">
                 <input className="input-style" type="password" placeholder="Введите пароль"/>
              </div>
              <div className="row form-text">
                 <div className="col">
                   Нет аккаунта? <a href="#" onClick={setRegistrationForm}>Зарегистрируйтесь!</a>
                 </div>
              </div>
              <div className="row justify-content-center button-container">
                  <input className="button-element" type="button" value="Войти" onClick={execLogIn}/>
               </div>
               <div className="row justify-content-center logo-container">
                  <img className="logo" src="/image/logohuman.png" alt=""/>
              </div>
           </div>
          </div>
        </div>
    );
}