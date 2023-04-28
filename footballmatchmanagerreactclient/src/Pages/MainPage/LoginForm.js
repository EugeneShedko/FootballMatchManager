import React, { useContext, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { TO_ACCAUNT, TO_MAIN, TO_REGISTRATION } from "../../Utilts/Consts";
import { Context } from "../../index";
import { HubConnectionBuilder } from "@microsoft/signalr";
import {displayNotifMess} from "./../../addtionalcomponents/AuxiliaryFunctions";
import axios from "axios";
import { toast } from "react-toastify";

import "./../../css/loginform.css";

export default function Loginform(props) {

    const [loginContainerStyle, setLoginContainerStyle] = useState("col-3 logincontainer");
    const navigate = useNavigate();
    const { userContext, setUserContext } = useContext(Context);
    const [isValid, setIsValid] = useState(false);

    const [logInState, setLogInState] = useState({
        userEmail: "",
        userPassword: ""
    }
    );

    const [inputDirty, setInputDirty] = useState({
        emailDirty: false,
        passwordDirty: false,
     });
  
     const [inputError, setInputError] = useState({
        emailError: "Email не может быть пустым",
        passwordError: 'Пароль не может быть пустым',
     });

     // ------------------------------------------------------- //

     const blurHandler = (e) => {
        switch(e.target.name)
        {
           case "userEmail": 
              setInputDirty({...inputDirty, emailDirty:true});
              break;
           case "userPassword": 
              setInputDirty({...inputDirty, passwordDirty:true}); 
              break;
        }
     }

     // -------------------------------------------------------- //

     useEffect(() => {
        if(inputError.emailError || inputError.passwordError)
        {
            setIsValid(false);
        }
        else
        {
            setIsValid(true);
        }
     }, [inputError])

     // ------------------------------------------------------- //

     function emailHandler(e)
     {
        setLogInState({ ...logInState, userEmail:e.target.value })
        const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if(!re.test(String(e.target.value).toLowerCase()))
        {
            setInputError({...inputError, emailError: "Email не корректен"});
        }
        else
        {
            setInputError({...inputError, emailError: ""});         
        }
     }

     // ---------------------------------------------------------------------- //

     function passwordHandler(e)
     {
        setLogInState({ ...logInState, userPassword:e.target.value })
        if(e.target.value.length < 5)
        {
            setInputError({...inputError, passwordError: 'Длинна пароля менее 5 символов'});     
        }
        else
        {
            setInputError({...inputError, passwordError: ""});    
        }
     }
  
    function closeLoginForm() {
        setLoginContainerStyle("col-3 logincontainerout");
        setTimeout(() => navigate(TO_MAIN), 500);
    }

    // -------------------------------------------------------------------------- //

    function execLogIn(event) {

        event.preventDefault();

        const data = new FormData();
        data.append("userEmail", logInState.userEmail);
        data.append("userPassword", logInState.userPassword);

        axios.post('http://localhost:5004/api/auth/authorization', data, { withCredentials: true })
            .then((response) => {
                toast.success(response.data.message, {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000,
                    pauseOnFocusLoss: false
                });

                if(response.data.user.role === "user")
                {

                    const conn = connectGame();

                    setUserContext({...useContext, 
                        notificonn: conn,
                        isAuth: true,
                        isAdmin: false,
                        userId: response.data.user.pkId,
                        userName: response.data.user.firstName + ' ' + response.data.user.lastName});

                    navigate(TO_ACCAUNT);
                }
                else
                {
                    /*
                    user.setAdmin(true);
                    user.setAuth(false);
                    user.setUserId(response.data.user.apUserId);
                    user.setUserName('Администратор');
                    navigate(ADMIN_PROFILE_ROUTE);
                    */
                }

            })
            .catch((error) => {
                if (error.response) {
                    toast.error(error.response.data.message,
                        {
                            position: toast.POSITION.TOP_CENTER,
                            autoClose: 2000,
                            pauseOnFocusLoss: false
                        });
                }
            });
    }

    // ---------------------------------------------------------------------------------------------- //

    /* Не асинхронно, наверное это хреново, подругому не получалось */
    const connectGame = () => {
        const nothubconn = new HubConnectionBuilder().withUrl("http://localhost:5004/notification")
                                                     .build();
        

        nothubconn.on("displayNotifi", displayNotifMess);

        nothubconn.start();
        return nothubconn;
    }

    // ---------------------------------------------------------------------------------------------- //

    return (
        <div className="row justify-content-center m-0">
            <div className={loginContainerStyle}>
                <div className="row justify-content-end">
                    <img id="closeicon" src="/image/closecross.png" alt="" onClick={closeLoginForm} />
                </div>
                <div id="form-container" className="row">
                    <div>
                        <form onSubmit={execLogIn}>
                            <div className="loginheadtext">
                                Войти
                            </div>
                            <div className="row justify-content-center input-container">
                            {(inputDirty.emailDirty && inputError.emailError ) && <div style={{color:'red', marginTop: '-5%'}}>{inputError.emailError}</div>}
                                <input name="userEmail" 
                                    className="input-style"
                                    type="text"
                                    placeholder="Введите email"
                                    onBlur={e => blurHandler(e)}
                                    onChange = {(event) => emailHandler(event)}
                                />
                            </div>
                            <div className="row justify-content-center input-container">
                            {(inputDirty.passwordDirty && inputError.passwordError ) && <div style={{color:'red', marginTop: '-5%'}}>{inputError.passwordError}</div>}
                                <input name="userPassword" 
                                    className="input-style"
                                    type="password"
                                    placeholder="Введите пароль"
                                    onBlur={e => blurHandler(e)}
                                    onChange = {(event) => passwordHandler(event)}
                                />
                            </div>
                            <div className="row form-text">
                                <div className="col">
                                    Нет аккаунта? <Link to={TO_REGISTRATION}>Зарегистрируйтесь!</Link>
                                </div>
                            </div>
                            <div className="row justify-content-center button-container">
                                <input className="button-element" 
                                       type="submit" 
                                       value="Войти"
                                       disabled={!isValid} 
                                       />
                            </div>
                            <div className="row justify-content-center logo-container">
                                <img className="logo" src="/image/logohuman.png" alt="" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}