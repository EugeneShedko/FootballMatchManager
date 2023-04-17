/*Нужно чтобы страница матча и турнира отображалась корректно на главной страница
  и на странице в профиле пользователя, так как контейнеры имеют разные размеры*/
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TO_GAME_CARD, TO_TEAM_GAME_CARD } from "../../../../Utilts/Consts";

import "./../../../../css/TeamsGames/TeamGameBlock.css";

export default function TeamBlock(props) {

    const navigate = useNavigate();

    function setGameInfoCard() {
        navigate(TO_GAME_CARD + '/' + props.info.pkId);
    }

    // -------------------------------------------------------------------------------- //

    return (
        <div className="team-container" onClick={setGameInfoCard}>
            <div className="team-back-block" />
            <div className="row team-block-content">
                <div className="col m-0 p-0">
                    <div className="row m-0 p-0">
                        <div className="col-4 m-0 p-0">
                            <img className="team-logo"
                                src="http://localhost:5004/default/sad-face.png"
                                alt="" />
                        </div>
                        <div className="col-4 team-versus-cont">
                            <img className="team-versus"
                                src="http://localhost:5004/default/versus.png"
                                alt="" />
                        </div>
                        <div className="col-4 m-0 p-0">
                            <img className="team-logo"
                                src="http://localhost:5004/default/sad-face.png"
                                alt="" />
                        </div>
                    </div>
                    <div className="row info-container">
                        Хрен1
                    </div>
                    <div className="row info-container">
                        Хрен2
                    </div>
                    <div className="row info-container">
                        Хрен3
                    </div>
                </div>
            </div>
        </div>
    );
}