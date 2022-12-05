import React, { useState } from "react"
import { useNavigate } from "react-router-dom";
import { MAIN_ROUTE, USER_PROFILE_ROUTE } from "../../Utilts/Consts";
import "./../../css/loginform.css";

export default function FRegistrationform(props) {

   const navigate = useNavigate();
   const [loginContainerStyle, setLoginContainerStyle] = useState("col-3 logincontainer");
   const [regFormState, setRegFormState] = useState({
      currentStep: 1,
      userEmail: 'Хрен Моржовый',
      userName: '',
      userSurname: '',
      userSex: '',
      userPosition: '',
      userBirthDay: '',
      userPassword: ''
   });

   function setValue(event)
   {
      const {name, value} = event.target;
      setRegFormState({ ...regFormState, [name]:value})
   }

   function closeLoginForm() 
   {
      setLoginContainerStyle("col-3 logincontainerout");
      setTimeout(() => navigate(MAIN_ROUTE), 500);
   }

   function execLogIn() 
   {
      navigate(USER_PROFILE_ROUTE);
   }

   function setNextRegForm()
   {
      let currentStep = regFormState.currentStep;
      currentStep = currentStep >=2 ? 2 : currentStep + 1; 
      setRegFormState({...regFormState, currentStep: currentStep})
   }

   function setBackRegForm()
   {
      let currentStep = regFormState.currentStep;
      currentStep = currentStep <= 1 ? 1 : currentStep - 1;
      setRegFormState({...regFormState, currentStep: currentStep})       
   }

   return (
      <div className="row justify-content-center h-100">
         <div className={loginContainerStyle}>
            <div className="row justify-content-end">
               <img id="closeicon" src="/image/closecross.png" alt="" onClick={closeLoginForm} />
            </div>
            <div id="form-container" className="row">
               <div>
                  <div className="loginheadtext">
                     Регистрация
                  </div>

                  <FirstRegPart regState       = {regFormState}
                                setNextForm    = {setNextRegForm} 
                                setChangeValue = {setValue} 
                                />
                  <SecRegPart   regState       = {regFormState}
                                setBackForm    = {setBackRegForm}
                                setChangeValue = {setValue}
                                execLogiIn     = {execLogIn}
                                />
               </div>
            </div>
         </div>
      </div>
   );
}


function FirstRegPart(props) {

   if(props.regState.currentStep !== 1)
   {
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
            <input className="button-element" type="button" value="Далее" onClick={props.setNextForm}/>
         </div>
      </div>
   );
}

function SecRegPart(props)
{
   const navigate = useNavigate();
   if(props.regState.currentStep !== 2)
   {
      return null;
   }

   return(
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
      <div className       = "row justify-content-center input-container">
        <input name        = "userBirthDay" 
               className   = "input-style"
               type        = "text"
               placeholder = "Укажите дату рождения"
               value       = {props.regState.userBirthDay}
               onChange    = {props.setChangeValue}
         />
      </div>
      <div className ="row justify-content-center input-container">
        <input name        = "userPassword"
               className   = "input-style"
               type        = "password"
               placeholder = "Задайте пароль"
               value       = {props.regState.userPassword}
               onChange    = {props.setChangeValue}
         />
      </div>
      <div className="row justify-content-center button-container">
        <input className="button-element" type="button" value="Назад" onClick={props.setBackForm}/>
        <input className = "button-element" 
               type      = "button" 
               value     = "Зарегистрироваться" 
               onClick   = {props.execLogiIn}/>
      </div>
    </div>
   );
}