import React, { useContext, useState } from "react"
import "./../../css/loginform.css"
import { Link, useNavigate } from "react-router-dom";
import { ADMIN_PROFILE_ROUTE, MAIN_ROUTE, REGISTRATION_ROUTE, USER_PROFILE_ROUTE } from "../../Utilts/Consts";
import axios from "axios";
import { Context } from "./../../index";
import { toast } from "react-toastify";

export default function Loginform(props) {

    const [loginContainerStyle, setLoginContainerStyle] = useState("col-3 logincontainer");
    const navigate = useNavigate();

    const [logInState, setLogInState] = useState({
        userEmail: "",
        userPassword: ""
    }
    );

    const { user } = useContext(Context);

    function closeLoginForm() {
        setLoginContainerStyle("col-3 logincontainerout");
        setTimeout(() => navigate(MAIN_ROUTE), 500);
    }

    function execLogIn(event) {

        event.preventDefault();

        const data = new FormData();
        data.append("userEmail", logInState.userEmail);
        data.append("userPassword", logInState.userPassword);

        axios.post('https://localhost:7277/api/auth/authorization', data, { withCredentials: true })
            .then((response) => {
                toast.success(response.data.message, {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000,
                    pauseOnFocusLoss: false
                });


                if(response.data.user.userRole === "user")
                {
                    user.setAdmin(false);
                    user.setAuth(true);
                    user.setUserId(response.data.user.apUserId);
                    user.setUserName(response.data.user.userFirstName + ' ' + response.data.user.userLastName);
                    navigate(USER_PROFILE_ROUTE);
                }
                else
                {
                    user.setAdmin(true);
                    user.setAuth(false);
                    user.setUserId(response.data.user.apUserId);
                    user.setUserName('Администратор');                    
                    navigate(ADMIN_PROFILE_ROUTE);    
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
                                <input className="input-style"
                                    type="text"
                                    placeholder="Введите email"
                                    onChange = {(event) => setLogInState({ ...logInState, userEmail:event.target.value })}
                                />
                            </div>
                            <div className="row justify-content-center input-container">
                                <input className="input-style"
                                    type="password"
                                    placeholder="Введите пароль"
                                    onChange = {(event) => setLogInState({ ...logInState, userPassword:event.target.value })}
                                />
                            </div>
                            <div className="row form-text">
                                <div className="col">
                                    Нет аккаунта? <Link to={REGISTRATION_ROUTE}>Зарегистрируйтесь!</Link>
                                </div>
                            </div>
                            <div className="row justify-content-center button-container">
                                <input className="button-element" type="submit" value="Войти" />
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