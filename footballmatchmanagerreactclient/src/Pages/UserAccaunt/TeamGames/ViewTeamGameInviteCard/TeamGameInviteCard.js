import { useContext, useEffect, useState } from "react";
import "./../../../../css/GameInvite/GameInvite.css";
import { toast } from "react-toastify";
import axios from "axios";
import TeamGenerator from "../../Teams/ViewTeams/TeamsGenerator";
import { TO_TEAM_GAME_CARD } from "../../../../Utilts/Consts";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../../../..";

export default function TeamGameInviteCard() {

    const { userContext } = useContext(Context);
    const navigate = useNavigate();
    /* Айди игры */
    const [teamGameId, setTeamGameId] = useState(parseInt(useParams().id));
    /* Список команд, для приглашения */
    const [inviteTeams, setInviteTeams] = useState([]);
    /* Список команд, которым отправлены приглашения */
    const [notifiTeams, setNotifiTeams] = useState([]);
    const [searchString, setSearchString] = useState("");

    // ----------------------------------------------------------------------------------------- //

    useEffect(
        () => {
            axios.get('http://localhost:5004/api/teamgame/invite-team/' + teamGameId, { withCredentials: true })
                .then((response) => {
                    setInviteTeams(response.data);
                })
                .catch(userError => {
                    if (userError.response) {
                        toast.error(userError.response.message,
                            {
                                position: toast.POSITION.TOP_CENTER,
                                autoClose: 2000,
                                pauseOnFocusLoss: false
                            });
                    }
                });

            axios.get('http://localhost:5004/api/notification/sent-invit-team/' + teamGameId, { withCredentials: true })
                .then((response) => {
                    setNotifiTeams(response.data);
                })
                .catch(userError => {
                    if (userError.response) { }
                });

        }, []);

    // ---------------------------------------------------------------------- //

    function cancelInvite() {
        navigate(TO_TEAM_GAME_CARD + '/' + teamGameId);
    }

    // ----------------- Приглашение к участию в командном матче --------------- //

    function sendInviteToAddTeamGame(id) {

        var conn = userContext.notificonn;
        conn.invoke("InvitationToTeamGame", parseInt(id), teamGameId);
        setNotifiTeams([...notifiTeams, { pkId: parseInt(id) }]);

    }


    // -------------- Сброс фильтрации ---------------- //

    function resetFilter() {

        /*
        setFilter({
            position: '',
            goals: 0,
            assists: 0
        })
        */
    }

    // ------------------------------------------------- //

    return (
        <div className="row mi-info-main-container">
            <div className="col-11 mi-info-container">
                <div className="row mi-top-cont">
                    <div className="col-3 mi-top-col mi-search-cont">
                        <input className="search-player-element"
                            type="text"
                            placeholder="Введите имя команды"
                            value={searchString}
                            onChange={e => setSearchString(e.target.value)}
                        />
                    </div>
                    <div className="col-3 mi-top-col">
                        {/*
                        <select className="filter-player-element"
                        onChange={(e) => {
                            setFilter({ ...filter, position: e.target.value })
                        }}
                        >
                            <option selected value=""> Позиция </option>
                                positions?.map((position) => (
                                    <option>{position.strValue}</option>
                                ))
                        </select>
                        */}
                    </div>
                    <div className="col-2 mi-top-col">
                        {/*
                        <div className="row filter-text">
                            Мин. голов {filter.goals}
                        </div>
                        <div className="row m-0 p-0">
                            <input type="range"
                                min={0}
                                max={1000}
                                step={5}
                            value={filter.goals}
                            onChange={(e) => {
                                setFilter({ ...filter, goals: e.target.value })
                            }}
                            />
                        </div>
                        */}
                    </div>
                    <div className="col-2 mi-top-col">
                        {/*
                        <div className="row filter-text">
                            Мин. передач {filter.assists}
                        </div>
                        <div className="row m-0 p-0">
                            <input type="range"
                                min={0}
                                max={1000}
                                step={5}
                            //value={filter.assists}
                            onChange={(e) => {
                                setFilter({ ...filter, assists: e.target.value })
                            }}
                            />
                        </div>
                    */}
                    </div>
                    <div className="col-2 mi-top-col reset-button-cont">
                        <input className="reset-button"
                            type="button"
                            value="Сбросить"
                            onClick={resetFilter}
                        />
                    </div>
                </div>
                <div className="row mi-user-container">
                    <TeamGenerator teams={inviteTeams}
                        searchString={searchString}
                        notifiTeams={notifiTeams}
                        sendInviteToAddTeamGame={sendInviteToAddTeamGame}

                    />
                </div>
                <div className="row mi-button-cont">
                    <input className="cancel-button"
                        type="button"
                        value="Отмена"
                        onClick={cancelInvite}
                    />
                </div>
            </div>
        </div>
    )
}