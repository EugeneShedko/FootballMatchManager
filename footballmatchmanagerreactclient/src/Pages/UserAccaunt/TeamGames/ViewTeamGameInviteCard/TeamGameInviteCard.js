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
    /* Первоначальный список команд */
    const [initialTeams, setInitialTeams] = useState([]);
    /* Список команд, для приглашения */
    const [inviteTeams, setInviteTeams] = useState([]);
    /* Список команд, которым отправлены приглашения */
    const [notifiTeams, setNotifiTeams] = useState([]);
    const [searchString, setSearchString] = useState("");
    /* Объект фильтрации */
    const [filter, setFilter] = useState({
        gamesQnt: 0,
        winsGamesQnt: 0,
        goalsQnt: 0
    });

    // ----------------------------------------------------------------------------------------- //

    useEffect(
        () => {
            axios.get('http://localhost:5004/api/teamgame/invite-team/' + teamGameId, { withCredentials: true })
                .then((response) => {
                    setInitialTeams(response.data);
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

    // -------------- Фильтрация команд ---------------- //

    useEffect(() => {

        var filterTeams = [];
        filterTeams = initialTeams.filter(team => team.gamesQnt >= filter.gamesQnt);

        filterTeams = filterTeams.filter(team => team.winsQnt >= filter.winsGamesQnt);

        filterTeams = filterTeams.filter(team => team.scoredGoalsQnt >= filter.goalsQnt);

        setInviteTeams(filterTeams);

    }, [filter]);

    // -------------- Сброс фильтрации ---------------- //

    function resetFilter() {

        setFilter({
            gamesQnt: 0,
            winsGamesQnt: 0,
            goalsQnt: 0
        })
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
                    <div className="col-2 mi-top-col">
                        <div className="row filter-text">
                            Мин. матчей {filter.gamesQnt}
                        </div>
                        <div className="row m-0 p-0">
                            <input type="range"
                                min={0}
                                max={1000}
                                step={5}
                                value={filter.gamesQnt}
                                onChange={(e) => {
                                    setFilter({ ...filter, gamesQnt: e.target.value })
                                }}
                            />
                        </div>
                    </div>
                    <div className="col-2 mi-top-col">
                        <div className="row filter-text">
                            Мин. побед {filter.winsGamesQnt}
                        </div>
                        <div className="row m-0 p-0">
                            <input type="range"
                                min={0}
                                max={1000}
                                step={5}
                                value={filter.winsGamesQnt}
                                onChange={(e) => {
                                    setFilter({ ...filter, winsGamesQnt: e.target.value })
                                }}
                            />
                        </div>
                    </div>
                    <div className="col-2 mi-top-col">
                        <div className="row filter-text">
                            Мин. голов {filter.goalsQnt}
                        </div>
                        <div className="row m-0 p-0">
                            <input type="range"
                                min={0}
                                max={1000}
                                step={5}
                                value={filter.goalsQnt}
                                onChange={(e) => {
                                    setFilter({ ...filter, goalsQnt: e.target.value })
                                }}
                            />
                        </div>
                    </div>
                    <div className="col-3 mi-top-col reset-button-cont">
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