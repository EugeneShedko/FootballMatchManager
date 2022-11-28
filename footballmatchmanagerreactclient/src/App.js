import React from "react"
import "./css/mainpage.css"
export default function App() {
  return (
    <div id="main-containter" className="container-fluid p-0 m-0 vh-100 vw-100">
      <div id="back-container"/>
      <div id="header" className="row justify-content-center align-items-center">
        <div className="col-auto h-100 p-0 m-0">
          <div className="row h-100 align-items-center p-0 m-0 ">
          <img id="logoimg" alt="" src="image/WhiteLogo.png"/>
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
            <input id="blogin" type="button" value="Войти"/>
          </div>
        </div>
      </div>

      <div id="body-content" className="row justify-content-center">
        <div className="col-3 p-0 m-0">
          {/*Вот это должно автоматически заполнятся из запроса*/}
          <div className="row info-block">
            <div className="info-block-back"/>
              <div className="info-block-content">
                <div className="row info-block-row">
                  <div className="info-block-column-left">
                    Игра векаddddddddddddddddddddd!
                  </div>
                  <div className="info-block-column-right">
                    18.10.2022 15:00
                  </div>
                </div>
                <div className="row info-block-row">
                  <div className="info-block-column-left"/>
                  <div className="info-block-column-right">
                    11x11
                  </div>
                </div>
                <div className="row info-block-row">
                  <div className="info-block-column-left"/>
                  <div className="info-block-column-right">
                    2-й пер.Шевченко 25A dddddddddddddddddddddddddddd
                  </div>
                </div>
                <div className="row info-block-row">
                  <div className="info-block-column-left"/>
                  <div className="info-block-column-right">
                    10/22
                  </div>
                </div>
              </div>
            </div>
          <div className="row info-block">
            <div className="info-block-back">
            </div>
          </div>
          <div className="row info-block">
            <div className="info-block-back">
            </div>
          </div>
          <div className="row info-block">
            <div className="info-block-back">
            </div>
          </div>
          <div className="row info-block">
            <div className="info-block-back">
            </div>
          </div>
        </div>  
        <div className="col-3 p-0 m-0">
        <div className="row info-block">
            <div className="info-block-back">
            </div>
          </div>
          <div className="row info-block">
            <div className="info-block-back">
            </div>
          </div>
          <div className="row info-block">
            <div className="info-block-back">
            </div>
          </div>
          <div className="row info-block">
            <div className="info-block-back">
            </div>
          </div>
          <div className="row info-block">
            <div className="info-block-back">
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
