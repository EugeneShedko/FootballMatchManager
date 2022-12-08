import React, { useState } from "react"
import "./../../css/loginform.css"
import { Link, useNavigate } from "react-router-dom";
import { MAIN_ROUTE, REGISTRATION_ROUTE, USER_PROFILE_ROUTE } from "../../Utilts/Consts";

export default function Loginform(props) {
    const [loginContainerStyle, setLoginContainerStyle] = useState("col-3 logincontainer");
    const navigate = useNavigate();

    function closeLoginForm() {
        setLoginContainerStyle("col-3 logincontainerout");
        setTimeout(() => navigate(MAIN_ROUTE), 500);
    }

    function execLogIn() {
        navigate(USER_PROFILE_ROUTE);
    }

    return (
        <div className="row justify-content-center m-0">
            <div className={loginContainerStyle}>
                <div className="row justify-content-end">
                    <img id="closeicon" src="/image/closecross.png" alt="" onClick={closeLoginForm} />
                </div>
                <div id="form-container" className="row">
                    <div>
                        <div className="loginheadtext">
                            Войти
                        </div>
                        <div className="row justify-content-center input-container">
                            <input className="input-style" type="text" placeholder="Введите email" />
                        </div>
                        <div className="row justify-content-center input-container">
                            <input className="input-style" type="password" placeholder="Введите пароль" />
                        </div>
                        <div className="row form-text">
                            <div className="col">
                                Нет аккаунта? <Link to={REGISTRATION_ROUTE}>Зарегистрируйтесь!</Link>
                            </div>
                        </div>
                        <div className="row justify-content-center button-container">
                            <input className="button-element" type="button" value="Войти" onClick={execLogIn} />
                        </div>
                        <div className="row justify-content-center logo-container">
                            <img className="logo" src="/image/logohuman.png" alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}