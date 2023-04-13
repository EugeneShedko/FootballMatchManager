
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../../../index"
import { HubConnectionBuilder } from "@microsoft/signalr";

import PlayerBlock from "../Players/ViewPlayers/PlayerBlock";
import MessagesBlock from "./../Games/ViewGameCard/MessagesBlock";
import "./../../../css/Teams/TeamInfoCard.css";

/* Можно было бы функции вынести просто в отдельный файл, вид карточки один */
/* А у меня получилось два компонента для этого */

export default function UserTeamsInfoCard(props) {

    const { user } = useContext(Context);
    const [team, setTeam] = useState({});
    const [teamUsers, setTeamUsers] = useState([]);
    const [userTeams, setUserTeams] = useState([]);

    // -------------------------------------------------------------------------------------------------------------------------- //

    /* Новый запрос на сервер для получения команды */

    useEffect(() => {

        axios.get('http://localhost:5004/api/team/user-team', { withCredentials: true })
            .then((response) => {

                /* Пока что не понятно, что будет если приедт null */
                /* Состояние для хранения листа айдишников */
                getTeamInfo(response.data.firstTeamId);
                setUserTeams(response.data.teamsPart)
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
    }, []);

    // -------------------------------------------------------------------------------------------------------------------------- //

    function getTeamInfo(teamId) {
        /* Здесь же сразу можно было добавить вычет сообщений */

        axios.get('http://localhost:5004/api/team/team/' + teamId, { withCredentials: true })
            .then((response) => {
                setTeam(response.data.currteam);
            })
            .then(() => {
                axios.get('http://localhost:5004/api/team/team-users/' + teamId, { withCredentials: true })
                    .then((response) => {
                        setTeamUsers(response.data);
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
    }

    // -------------------------------------------------------------------------------------------------------------------------- //

    function leaveTeam() {

        axios.delete('http://localhost:5004/api/profile/leavefromteam/' + props.teamId + '/' + user.getUserId, { withCredentials: true })
            .then((response) => {
                toast.success(response.data.message,
                    {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                        pauseOnFocusLoss: false
                    });
                setTeam(response.data.currteam);
                setTeamUsers(response.data.users);
            })
            .catch((error) => {
                if (error.response) {
                    toast.error(error.response.data.message,
                        {
                            position: toast.POSITION.BOTTOM_RIGHT,
                            autoClose: 2000,
                            pauseOnFocusLoss: false
                        });
                }
            });

    }

    // -------------------------------------------------------------------------------------------------------------------------- //

    return (
        <div className="row justify-content-center team-info-main-container">
            <div className="col-12 team-info-container">
                <div className="row m-0 h-100">
                    <div className="col-5 team-info-text-container">
                        <div className="row team-info-title">
                            {team.name}
                        </div>
                        <div className="row m-0 p-0">
                            <div className="col-6 m-0 p-0">
                                <div className="row m-0 p-0">
                                    <img className="team-image"
                                        src={"http://localhost:5004/" + team.image}
                                        alt=""
                                    />
                                </div>
                                <div className="row team-join-button-container">
                                    <input className="match-join-button"
                                        type="button"
                                        value="Покинуть"
                                        onClick={leaveTeam} />
                                </div>
                            </div>
                            <div className="col-6 m-0 p-0">
                                <div className="row team-info-header">
                                    Дата создания команды
                                </div>
                                <div className="row team-info-text">
                                    {(new Date(team.crtDate)).toLocaleString().substring(0, (new Date(team.crtDate)).toLocaleString().length - 3)}
                                </div>
                                <div className="row team-info-header">
                                    Описание команды
                                </div>
                                <div className="row team-info-text team-desc">
                                    {team.description}
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        <div className="col-4 team-info-user-container">
                            <div className="team-info-user-absolute-container">
                                {
                                    teamUsers.map((player) => (
                                        <div className="row m-0">
                                            <PlayerBlock info={player} />
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    }
                    <div className="col-3 p-0 h-100">
                        <div className="row team-switch-cont">
                            <select name="userSex"
                                    /* value={props.regState.userSex} */
                                    className="form-select form-select-sm team-switch"
                                     onChange={e => getTeamInfo(e.target.value)}>
                                    {
                                        userTeams.map((team) => (
                                            <option value={team.pkId} >{team.name}</option>
                                        ))
                                    }    
                            </select>
                        </div>
                        <div className="row team-mess-cont">
                            {/* Проблема блока, что везде ему передается айди игры */}
                            <MessagesBlock gameId={props.gameId} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}    