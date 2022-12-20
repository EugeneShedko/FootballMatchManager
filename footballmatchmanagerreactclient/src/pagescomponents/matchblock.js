/*Нужно чтобы страница матча и турнира отображалась корректно на главной страница
  и на странице в профиле пользователя, так как контейнеры имеют разные размеры*/
import { useState } from "react";
import "./../css/match.css";
import MatchInfoPage from "./matchinfopage";

export default function MatchBlock(props) {

    function setMatchInfoPage()
    {
        props.setContState(<MatchInfoPage gameId={props.info.gameId}
                                          setGames={props.setGames}
                                          setContState={props.setContState} />);
    }

    return (
        <div className="match-container" onClick={setMatchInfoPage}>
            <div className="match-back-block" />
            <div className="row match-block-content">
                <div className="col-5 match-block-column">
                    <div className="row m-0">
                        {props.info.gameName}
                    </div>
                </div>
                <div className="col-7 match-block-column">
                    <div className="row m-0">
                        {(new Date(props.info.gameDateTime)).toLocaleString().substring(0, (new Date(props.info.gameDateTime)).toLocaleString().length - 3)}
                    </div>
                    <div className="row m-0">
                        {props.info.gameFormat}
                    </div>
                    <div className="row m-0">
                        {props.info.gameAdress}
                    </div>
                    <div className="row m-0">
                        {props.info.currentPlayers}/{props.info.gameMaxPlayers}
                    </div>
                </div>
            </div>
        </div>
    );
}