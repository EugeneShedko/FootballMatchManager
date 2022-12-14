import axios from "axios";
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MAIN_ROUTE, LOGIN_ROUTE } from "../../Utilts/Consts";
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

      axios.post('http://localhost:5000/api/auth/registration', user, { withCredentials: true })
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
                     ??????????????????????
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

   const [isFFValid, setIsFFValid] = useState(false);

   const [fInputDirty, setFInputDirty] = useState({
      emailDirty: false,
      nameDirty: false,
      surnameDirty: false,
      sexDirty: false,
   });

   const [fInputError, setFInputError] = useState({
      emailError: "Email ???? ?????????? ???????? ????????????",
      nameError: '?????? ???? ?????????? ???????? ????????????',
      surnameError: '?????????????? ???? ?????????? ???????? ????????????',
      sexError: '?????? ???? ?????????? ???????? ????????????',
   });

   useEffect(() => {
      if(fInputError.emailError || fInputError.nameError || fInputError.surnameError || fInputError.sexError)
      {
         setIsFFValid(false);
      }
      else
      {
         setIsFFValid(true);
      }
   }, [fInputError])

   const blurHandler = (e) => {
      switch(e.target.name)
      {
         case "userEmail": 
            setFInputDirty({...fInputDirty, emailDirty:true});
            break;
         case "userName": 
            setFInputDirty({...fInputDirty, nameDirty:true}); 
            break;
         case "userSurname": 
            setFInputDirty({...fInputDirty, surnameDirty:true});
            break;
         case "userSex": 
            setFInputDirty({...fInputDirty, sexDirty:true});
            break;
      }
   }

   if (props.regState.currentStep !== 1) {
      return null;
   }

   function emailHandler(e)
   {
      const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      props.setChangeValue(e);
      if(!re.test(String(e.target.value).toLowerCase()))
      {
         setFInputError({...fInputError, emailError: "Email ???? ??????????????????"});
      }
      else
      {
         setFInputError({...fInputError, emailError: ""});         
      }
   }

   function nameHandler(e)
   {
      props.setChangeValue(e);
      if(e.target.value !== '')
      {
         setFInputError({...fInputError, nameError: ""});         
      }
      else
      {
         setFInputError({...fInputError, nameError: '?????? ???? ?????????? ???????? ????????????'});
      }
   }

   function surNameHandler(e)
   {
      props.setChangeValue(e);
      if(e.target.value !== '')
      {
         setFInputError({...fInputError, surnameError: ""});         
      }
      else
      {
         setFInputError({...fInputError, surnameError: '?????????????? ???? ?????????? ???????? ????????????'});     
      }
   }

   function sexHandler(e)
   {
      props.setChangeValue(e);    
      if(e.target.value !== "???????????????? ??????")
      {
         setFInputError({...fInputError, sexError: ""});          
      }
      else
      {
         setFInputError({...fInputError, sexError: '?????? ???? ?????????? ???????? ????????????'});   
      }  
   }

   return (
      <div>
         <div className="row justify-content-center input-container">
         {(fInputDirty.emailDirty && fInputError.emailError ) && <div style={{color:'red'}}>{fInputError.emailError}</div>}
            <input name="userEmail" 
                   className="input-style"
                   type="text" placeholder="?????????????? email"
                   value={props.regState.userEmail}
                   onBlur={e => blurHandler(e)}
                   onChange={e => emailHandler(e)} />
         </div>
         <div className="row justify-content-center input-container">
         {(fInputDirty.nameDirty && fInputError.nameError) && <div style={{color:'red', marginTop: '-5%'}}>{fInputError.nameError}</div>}
            <input name="userName" 
                   value={props.regState.userName} 
                   className="input-style" 
                   type="text" 
                   placeholder="?????????????? ???????? ??????" 
                   onBlur={e => blurHandler(e)}
                   onChange={e => nameHandler(e)} />
         </div>
         <div className="row justify-content-center input-container">
         {(fInputDirty.surnameDirty && fInputError.surnameError) && <div style={{color:'red', marginTop: '-5%'}}>{fInputError.surnameError}</div>}
            <input name="userSurname" 
                   value={props.regState.userSurname} 
                   className="input-style" 
                   type="text" 
                   placeholder="?????????????? ???????? ??????????????" 
                   onBlur={e => blurHandler(e)}
                   onChange={e => surNameHandler(e)}
                  />
         </div>
         <div className="row justify-content-center input-container">
         {(fInputDirty.sexDirty && fInputError.sexError) && <div style={{color:'red', marginTop: '-5%'}}>{fInputError.sexError}</div>}
            <select name="userSex" 
                    value={props.regState.userSex} 
                    className="form-select form-select-sm input-style" 
                    onBlur={e => blurHandler(e)}
                    onChange={e => sexHandler(e)}>
               <option selected>???????????????? ??????</option>
               <option>??????????????</option>
               <option>??????????????</option>
            </select>
         </div>
         <div className="row justify-content-center button-container">
            <input className="button-element" 
                   type="button" 
                   value="??????????" 
                   disabled={!isFFValid}
                   onClick={props.setNextForm} 
                   />
         </div>
      </div>
   );
}

function SecRegPart(props) {

   const [isSFValid, setIsSFValid] = useState(false);

   const [sInputDirty, setSInputDirty] = useState({
      positionDirty:false,
      passwordDirty:false
   });

   const [sInputError, setSInputError] = useState({
      positionError: '?????????????? ???? ?????????? ???????? ????????????',
      passwordError: '???????????? ???? ?????????? ???????? ????????????'
   });

   useEffect(() => {
      if(sInputError.positionError || sInputError.passwordError)
      {
         setIsSFValid(false);
      }
      else
      {
         setIsSFValid(true);
      }
   }, [sInputError])

   const blurHandler = (e) => {
      switch(e.target.name)
      {
         case "userPosition": 
            setSInputDirty({...sInputDirty, positionDirty:true});
            break;
         case "userPassword": 
            setSInputDirty({...sInputDirty, passwordDirty:true}); 
            break;
      }
   }

   function positionHandler(e)
   {
      props.setChangeValue(e);    
      if(e.target.value !== "???????????????? ??????????????")
      {
         setSInputError({...sInputError, positionError: ""});          
      }
      else
      {
         setSInputError({...sInputError, positionError: '?????? ???? ?????????? ???????? ????????????'});   
      }  
   }

   function passwordHandler(e)
   {
      props.setChangeValue(e);
      if(e.target.value.length < 5)
      {
         setSInputError({...sInputError, passwordError: '???????????? ???????????? ?????????? 5 ????????????????'});     
      }
      else
      {
         setSInputError({...sInputError, passwordError: ""});    
      }
   }

   if (props.regState.currentStep !== 2) {
      return null;
   }

   return (
      <div className="registration-container">
         <div className="row justify-content-center input-container">
         {(sInputDirty.positionDirty && sInputError.positionError ) && <div style={{color:'red', marginTop: '-5%'}}>{sInputError.positionError}</div>}
            <select name="userPosition" 
                    className="form-select form-select-sm input-style" 
                    value={props.regState.userPosition}
                    onBlur={e => blurHandler(e)} 
                    onChange={e => positionHandler(e)}>

               <option selected>???????????????? ??????????????</option>
               <option>????????????????????</option>
               <option>?????????? ????????????????????????</option>
               <option>???????????? ????????????????????????</option>
               <option>?????????????????? ????????????????????????</option>
               <option>?????????????????????? ????????????????????????</option>
               <option>?????????????? ????????????????????????</option>
               <option>?????????? ????????????????</option>
               <option>???????????? ????????????????</option>
               <option>?????????????????????? ????????????????</option>
               <option>??????????????</option>
            </select>
         </div>
         {/*?????????? ???????????????? ?? placeholder*/}
         <div className="row justify-content-center input-container">
            <ReactDatePicker
                   className   = "input-style"
                   type        = "text"
                   placeholder = "?????????????? ???????? ????????????????"
                   value       = {props.regState.userBirthDay}
                   selected    = {props.regState.userBirthDay}
                   onChange={(date:Date) => props.someFunc({
                     ...props.regState, userBirthDay:date
                  })}
            />
         </div>
         <div className="row justify-content-center input-container">
         {(sInputDirty.passwordDirty && sInputError.passwordError ) && <div style={{color:'red', marginTop: '-5%'}}>{sInputError.passwordError}</div>}
            <input name="userPassword"
               className="input-style"
               type="password"
               placeholder="?????????????? ????????????"
               value={props.regState.userPassword}
               onBlur={e => blurHandler(e)}
               onChange = {e => passwordHandler(e)}
            />
         </div>
         <div className="row justify-content-center button-container">
            <input className="button-element" type="button" value="??????????" onClick={props.setBackForm} />
            <input className="button-element"
               type="submit"
               value="????????????????????????????????????"
               disabled={!isSFValid}
            />
         </div>
      </div>
   );
}