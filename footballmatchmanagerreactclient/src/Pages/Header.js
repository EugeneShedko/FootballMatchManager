import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LOGIN_ROUTE, TO_LOGIN } from "../Utilts/Consts";
import { Context } from "../index";
import { observer } from "mobx-react-lite";

const Header = observer(() => {

  const {userContext} = useContext(Context);

  const navigate = useNavigate();

  function login() {
    navigate(TO_LOGIN);
  }

  return (
    <div id="header" className="row justify-content-center align-items-center">
      <div className="col-auto h-100 p-0 m-0">
        <div className="row h-100 align-items-center p-0 m-0 ">
          <img id="logoimg" alt="" src="/image/WhiteLogo.png" />
        </div>
      </div>
      <div className="col-1 p-0 m-0"></div>
      <div className="col-auto p-0 m-0">
        <div className="row h-100 text-white align-items-center p-0 m-0">
          <h1 className="d-block p-0 m-0">Будь в игре вместе с нами!</h1>
        </div>
      </div>
      <div className="col-1 p-0 m-0"></div>
      <div className="col-2 h-100 p-0 m-0">
      <div className="row h-100 align-items-center justify-content-center p-0 m-0">
        {userContext.isAuth ? <div className="col d-flex" style={{fontSize:'25px'}}>{userContext.userName}</div> : userContext.isAdmin ? <div className="col d-flex" style={{fontSize:'25px'}}>{userContext.userName}</div> : <input id="blogin" type="button" value="Войти" onClick={login} />}
      </div>

      </div>
    </div>

)});

export default Header;