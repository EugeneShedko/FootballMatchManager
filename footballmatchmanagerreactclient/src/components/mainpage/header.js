import React, {useState} from "react";
import ReactDOM from 'react-dom/client';
import Loginform from "./../loginform";

export default function Header()
{
    const[isLoginForm, setIsLoginForm] = useState(false);

    function hideLoginForm()
    {
      setIsLoginForm(false);
    }

    function login()
    {
      ReactDOM.createRoot(document.getElementById("body-content")).render(<Loginform onClick={hideLoginForm}/>);
      setIsLoginForm(true);
    }
  
    return(
        <div id="header" className="row justify-content-center align-items-center">
        <div className="col-auto h-100 p-0 m-0">
          <div className="row h-100 align-items-center p-0 m-0 ">
          <img id="logoimg" alt="" src="/image/WhiteLogo.png"/>
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
          {isLoginForm ? null : <div className="row h-100 align-items-center justify-content-center p-0 m-0">
                        <input id="blogin" type="button" value="Войти" onClick={login}/></div>}
        </div>
      </div>

    );
}