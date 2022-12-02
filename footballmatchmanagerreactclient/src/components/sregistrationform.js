import React from "react"
import ReactDOM from 'react-dom/client';
import FRegistrationform from "./fregistrationform"
import UserProfile from "./userprofile/userprofile"

export default function SRegistrationform()
{
    function setBackRegForm()
    {
        {/*Нужно чтобы предыдущая форма как-то запоминала свое состояние*/}
        ReactDOM.createRoot(document.getElementById("form-container")).render(<FRegistrationform/>);
    }

    function setUserProfForm()
    {
        ReactDOM.createRoot(document.getElementById("body-content")).render(<UserProfile/>)
    }
    return(
         <div className="registration-container">
           <div className="loginheadtext">
             Регистрация
           </div>
           {/*Возможно это потом запросом с сервера выбирать*/}
           <div className="row justify-content-center input-container">
              <select className="form-select form-select-sm input-style">
                <option selected>Выберите позицию</option>
                <option>Нападающий</option>
                <option>Левый полузащитник</option>
                <option>Правый полузащитник</option>
                <option>Атакующий полузащитник</option>
                <option>Центральный полузащитник</option>
                <option>Опорный полузащитник</option>
                <option>Левый защитник</option>
                <option>Правый защитник</option>
                <option>Центральный защитник</option>
                <option>Вратарь</option>
              </select>
           </div>
           <div className="row justify-content-center input-container">
              <input className="input-style" type="text" placeholder="Укажите дату рождения"/>
           </div>
           <div className="row justify-content-center input-container">
              <input className="input-style" type="text" placeholder="Задайте пароль"/>
           </div>
           <div className="row justify-content-center button-container">
               <input className="button-element" type="button" value="Назад" onClick={setBackRegForm}/>
               <input className="button-element" type="button" value="Зарегистрироваться" onClick={setUserProfForm}/>
           </div>
          </div>
    );
} 