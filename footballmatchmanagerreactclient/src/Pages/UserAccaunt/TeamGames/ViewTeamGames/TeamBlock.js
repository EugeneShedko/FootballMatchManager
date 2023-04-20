/*Нужно чтобы страница матча и турнира отображалась корректно на главной страница
  и на странице в профиле пользователя, так как контейнеры имеют разные размеры*/
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TO_GAME_CARD, TO_TEAM_GAME_CARD } from "../../../../Utilts/Consts";

import "./../../../../css/TeamsGames/TeamGameBlock.css";

export default function TeamBlock(props) {

    const navigate = useNavigate();

    const teamLogoStyle = props.info.secondTeam.pkId === 1 ? "default-team-logo" : "team-logo";
    // -------------------------------------------------------------------------------- //

    function setGameInfoCard() {
        navigate(TO_TEAM_GAME_CARD + '/' + props.info.pkId);
    }

    // -------------------------------------------------------------------------------- //

    return (
        <div className="team-container" onClick={setGameInfoCard}>
            <div className="team-back-block" />
            <div className="row team-block-content">
                <div className="col m-0 p-0">
                    <div className="row info-container team-game-name">
                        {props.info.name}
                    </div>
                    <div className="row m-0 p-0">
                        <div className="col-4 team-logo-cont">
                            <img className="team-logo"
                                src={"http://localhost:5004/" + props.info.firstTeam.image}
                                alt="" />
                        </div>
                        <div className="col-4 team-versus-cont">
                            <img className="team-versus"
                                src="http://localhost:5004/default/versus.png"
                                alt="" />
                        </div>
                        <div className="col-4 team-logo-cont">
                            <img className={teamLogoStyle}
                                src={"http://localhost:5004/" + props.info.secondTeam.image}
                                alt="" />
                        </div>
                    </div>
                    <div className="row info-container">
                        {props.info.format}
                    </div>
                    <div className="row info-container">
                        {(new Date(props.info.dateTime)).toLocaleString().substring(0, (new Date(props.info.dateTime)).toLocaleString().length - 3)}
                    </div>
                    <div className="row info-container">
                        {props.info.adress}
                    </div>
                </div>
            </div>
        </div>
    );
}