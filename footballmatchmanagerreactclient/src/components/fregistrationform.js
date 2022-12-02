import React from "react"
import ReactDOM from 'react-dom/client';
import SRegistrationform from "./sregistrationform"

export default function FRegistrationform()
{
   function setNextRegForm()
   {
      ReactDOM.createRoot(document.getElementById("form-container")).render(<SRegistrationform/>)
   }
    return(
         <div>
           <div className="loginheadtext">
             Регистрация
           </div>
           <div className="row justify-content-center input-container">
             <input className="input-style" type="text" placeholder="Введите email"/>
           </div>
           <div className="row justify-content-center input-container">
              <input className="input-style" type="password" placeholder="Введите ваше имя"/>
           </div>
           <div className="row justify-content-center input-container">
              <input className="input-style" type="text" placeholder="Введите вашу фамилию"/>
           </div>
           <div className="row justify-content-center input-container">
              <select className="form-select form-select-sm input-style">
                <option selected>Выберите пол</option>
                <option>Мужской</option>
                <option>Женский</option>
              </select>
           </div>
           <div className="row justify-content-center button-container">
               <input className="button-element" type="button" value="Далее" onClick={setNextRegForm}/>
           </div>
          </div>
    );
} 