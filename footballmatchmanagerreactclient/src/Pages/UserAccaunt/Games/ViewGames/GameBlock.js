/*Нужно чтобы страница матча и турнира отображалась корректно на главной страница
  и на странице в профиле пользователя, так как контейнеры имеют разные размеры*/
import { useState } from "react";
import "./../../../../css/Game.css";
import GameInfoCard from "../ViewGameCard/GameInfoCard";

export default function MatchBlock(props) {

    function setGameInfoCard()
    {
        props.setContState(<GameInfoCard  gameId={props.info.pkId}
                                          setGames={props.setGames}
                                          setContState={props.setContState} />);
    }

    // -------------------------------------------------------------------------------- //

    return (
        <div className="match-container" onClick={setGameInfoCard}>
            <div className="match-back-block" />
            <div className="row match-block-content">
                <div className="col-5 match-block-column">
                    <div className="row m-0">
                        {props.info.name}
                    </div>
                </div>
                <div className="col-7 match-block-column">
                    <div className="row m-0">
                        {(new Date(props.info.dateTime)).toLocaleString().substring(0, (new Date(props.info.dateTime)).toLocaleString().length - 3)}
                    </div>
                    <div className="row m-0">
                        {props.info.format}
                    </div>
                    <div className="row m-0">
                        {props.info.adress}
                    </div>
                    <div className="row m-0">
                        {props.info.currPlayers}/{props.info.maxPlayers}
                    </div>
                </div>
            </div>
        </div>
    );
}