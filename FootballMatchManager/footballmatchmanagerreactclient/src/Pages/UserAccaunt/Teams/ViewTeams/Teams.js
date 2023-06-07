import { useContext, useEffect, useState } from "react";
import axios from "axios";

import TeamGenerator from "./TeamsGenerator";

import "./../../../../css/Teams/TeamsView.css"
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { TO_CREATE_TEAM } from "../../../../Utilts/Consts";
import { Context } from "../../../..";

export default function Teams() {

    const { userContext } = useContext(Context);
    const navigate = useNavigate();
    const location = useLocation();
    const [teams, setTeams] = useState([]);
    const [searchString, setSearchString] = useState("");

    // ---------------------------------------------------------------------------------------------- //

    useEffect(
        () => {
            axios.get('http://localhost:5004/api/team/get-all-tems', { withCredentials: true })
                .then((response) => {
                    setTeams(response.data);
                })
                .catch(userError => {
                    if (userError.response) {
                        console.log("Ошибка получения команд");
                    }
                });
            /* Хреново сделано обновление, скорее всего два раза рендерится компонент */
        }, [location.state && location.state.refresh]
    );

    // ---------------------------------------------------------------------------------------------- //

    return (
        <div className="row teams-main-container">
            <div className="col-9 tems-container">
                <TeamGenerator teams={teams}
                    setGames={setTeams}
                    searchString={searchString}
                />
            </div>
            <div className="col-3 team-create-block">
                <div className="row team-create-block-row">
                    {userContext.isAuth ?
                        <input className="team-button-style"
                            type="button"
                            value="Создать команду"
                            onClick={() => navigate(TO_CREATE_TEAM)}
                        />
                        : null}
                </div>
                <div className="row team-create-block-row">
                    <input id="search-team-element"
                        type="text"
                        placeholder="Введите название команды"
                        value={searchString}
                        onChange={(e) => setSearchString(e.target.value)}
                    />
                </div>

            </div>
            <Outlet />
        </div>
    );
}