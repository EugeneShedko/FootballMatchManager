import axios from "axios";
import React, { useState } from "react"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MAIN_ROUTE, USER_PROFILE_ROUTE, LOGIN_ROUTE } from "../../Utilts/Consts";
import "./../../css/loginform.css";
import "react-datepicker/dist/react-datepicker.css";
import ReactDatePicker from "react-datepicker";

export default function FRegistrationform(props) {

   const navigate = useNavigate();
   const [loginContainerStyle, setLoginContainerStyle] = useState("col-3 logincontainer");
   const [regFormState, setRegFormState] = useState({
      currentStep: 1,
      userEmail: '',
      userName: '',
      userSurname: '',
      userSex: '',
      userPosition: '',
      userBirthDay: new Date(),
      userPassword: ''
   });

   function setValue(event) {
      const { name, value } = event.target;
      setRegFormState({ ...regFormState, [name]: value })
   }

   function closeLoginForm() {
      setLoginContainerStyle("col-3 logincontainerout");
      setTimeout(() => navigate(MAIN_ROUTE), 500);
   }

   function execRegistration(e) {

      e.preventDefault();

      var modifiedLastName = regFormState.userSurname.trim().replace(/ +/g, ' ');
      var modifiedName = regFormState.userName.trim().replace(/ +/g, ' ');

      var user = {
         UserId: 0,
         UserEmail: regFormState.userEmail,
         UserPassword: regFormState.userPassword,
         UserLastName: modifiedLastName,
         UserName: modifiedName,
         UserSex: regFormState.userSex,
         UserBirthDay: regFormState.userBirthDay,
         UserPosition: regFormState.userPosition
      };

      axios.post('https://localhost:7277/api/auth/registration', user, { withCredentials: true })
         .then((response) => {
               toast.success(response.data, {
               position: toast.POSITION.BOTTOM_RIGHT,
               autoClose: 2000,
               pauseOnFocusLoss: false
            });
            navigate(LOGIN_ROUTE);
         })
         .catch(userError => {
            if (userError.response) {
               toast.error(userError.response.data.message, 
                  {
                  position: toast.POSITION.BOTTOM_RIGHT,
                  autoClose: 2000,
                  pauseOnFocusLoss: false
               });
            }
         });
}

   function setNextRegForm() {
      let currentStep = regFormState.currentStep;
      currentStep = currentStep >= 2 ? 2 : currentStep + 1;
      setRegFormState({ ...regFormState, currentStep: currentStep })
   }

   function setBackRegForm() {
      let currentStep = regFormState.currentStep;
      currentStep = currentStep <= 1 ? 1 : currentStep - 1;
      setRegFormState({ ...regFormState, currentStep: currentStep })
   }

   return (
      <div className="row justify-content-center h-100 m-0">
         <div className={loginContainerStyle}>
            <div className="row justify-content-end">
               <img id="closeicon" src="/image/closecross.png" alt="" onClick={closeLoginForm} />
            </div>
            <div id="form-container" className="row">
               <div>
                  <div className="loginheadtext">
                     Регистрация
                  </div>
                  <form onSubmit={execRegistration}>
                     <FirstRegPart regState={regFormState}
                        setNextForm={setNextRegForm}
                        setChangeValue={setValue}
                     />
                     <SecRegPart regState={regFormState}
                        setBackForm={setBackRegForm}
                        setChangeValue={setValue}
                        someFunc={setRegFormState}
                     />
                  </form>
               </div>
            </div>
         </div>
      </div>
   );
}


function FirstRegPart(props) {

   if (props.regState.currentStep !== 1) {
      return null;
   }

   return (
      <div>
         <div className="row justify-content-center input-container">
            <input name="userEmail" className="input-style"
               type="text" placeholder="Введите email"
               value={props.regState.userEmail}
               onChange={props.setChangeValue} />
         </div>
         <div className="row justify-content-center input-container">
            <input name="userName" value={props.regState.userName} className="input-style" type="text" placeholder="Введите ваше имя" onChange={props.setChangeValue} />
         </div>
         <div className="row justify-content-center input-container">
            <input name="userSurname" value={props.regState.userSurname} className="input-style" type="text" placeholder="Введите вашу фамилию" onChange={props.setChangeValue} />
         </div>
         <div className="row justify-content-center input-container">
            {/*Здесь возможно использовать свойство не value, а selected*/}
            <select name="userSex" value={props.regState.userSex} className="form-select form-select-sm input-style" onChange={props.setChangeValue}>
               <option selected>Выберите пол</option>
               <option>Мужской</option>
               <option>Женский</option>
            </select>
         </div>
         <div className="row justify-content-center button-container">
            <input className="button-element" type="button" value="Далее" onClick={props.setNextForm} />
         </div>
      </div>
   );
}

function SecRegPart(props) {
   if (props.regState.currentStep !== 2) {
      return null;
   }

   return (
      <div className="registration-container">
         <div className="row justify-content-center input-container">
            {/*Здесь возможно использовать свойство не value, а selected*/}
            <select name="userPosition" className="form-select form-select-sm input-style" value={props.regState.userPosition} onChange={props.setChangeValue}>
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
            <ReactDatePicker
                   className   = "input-style"
                   type        = "text"
                   placeholder = "Укажите дату рождения"
                   value       = {props.regState.userBirthDay}
                   selected    = {props.regState.userBirthDay}
                   onChange={(date:Date) => props.someFunc({
                     ...props.regState, userBirthDay:date
                  })}
            />
         </div>
         <div className="row justify-content-center input-container">
            <input name="userPassword"
               className="input-style"
               type="password"
               placeholder="Задайте пароль"
               value={props.regState.userPassword}
               onChange    = {props.setChangeValue}
            />
         </div>
         <div className="row justify-content-center button-container">
            <input className="button-element" type="button" value="Назад" onClick={props.setBackForm} />
            <input className="button-element"
               type="submit"
               value="Зарегистрироваться"
            />
         </div>
      </div>
   );
}