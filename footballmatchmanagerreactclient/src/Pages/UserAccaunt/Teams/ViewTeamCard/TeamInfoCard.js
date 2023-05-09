
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../../../../index"

import PlayerBlock from "../../Players/ViewPlayers/PlayerBlock";
import MessagesBlock from "./../../Games/ViewGameCard/MessagesBlock";
import "./../../../../css/Teams/TeamInfoCard.css";
import { useParams } from "react-router-dom";

export default function TeamInfoCard() {

    const { userContext } = useContext(Context);
    const [teamId, setTeamId] = useState(parseInt(useParams().id));
    const [team, setTeam] = useState({});
    const [teamUsers, setTeamUsers] = useState([]);
    const [isPart, setIsPart] = useState(false);

    // -------------------------------------------------------------------------------------------------------------------------- //

    useEffect(() => {

        axios.get('http://localhost:5004/api/team/team/' + teamId, { withCredentials: true })
            .then((response) => {
                setTeam(response.data.currteam);
                setIsPart(response.data.isPart);
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

    }, []);

    // -------------------------------------------------------------------------------------------------------------------------- //

    function requestToAddTeam() {

        var conn = userContext.notificonn;
        conn.invoke("RequestToAddTeam", teamId);
    }

    // -------------------------------------------------------------------------------------------------------------------------- //

    function leaveTeam() {

        /* Вычитывать пользователя нужно на сервере!!!!!! */
        axios.delete('http://localhost:5004/api/profile/leavefromteam/' + teamId + '/' + userContext.userId, { withCredentials: true })
            .then((response) => {
                toast.success(response.data.message,
                    {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                        pauseOnFocusLoss: false
                    });
                setTeam(response.data.currteam);
                setTeamUsers(response.data.users);
                setIsPart(false);
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
                        <div className="row team-info-text-container2">
                            <div className="col-6 team-info-column">
                                <div className="row team-image-cont">
                                    <img className="team-image"
                                        src={"http://localhost:5004/" + team.image}
                                        alt=""
                                    />
                                </div>
                                <div className="row team-join-button-container">
                                    {isPart ? null : <input className="team-join-button"
                                        type="button"
                                        value="Запрос на вступление"
                                        onClick={requestToAddTeam} />}
                                    {isPart ? <input className="match-join-button"
                                        type="button"
                                        value="Покинуть"
                                        onClick={leaveTeam} /> : null}
                                </div>
                            </div>
                            <div className="col-6 team-info-column">
                                <div className="row team-desc-row">
                                    <div className="team-info-header">
                                        Дата создания команды
                                    </div>
                                    <div className="row team-info-text">
                                        {(new Date(team.crtDate)).toLocaleString().substring(0, (new Date(team.crtDate)).toLocaleString().length - 3)}
                                    </div>
                                    <div className="team-info-header">
                                        Участников: <span className="team-info-text">{team.memberQnt}</span>
                                    </div>
                                    <div className="team-info-header">
                                        Матчей: <span className="team-info-text">{team.gamesQnt}</span>
                                    </div>
                                    <div className="team-info-header">
                                        Побед: <span className="team-info-text">{team.winsQnt}</span>
                                    </div>
                                    <div className="team-info-header">
                                        Поражений: <span className="team-info-text">{team.losesQnt}</span>
                                    </div>
                                    <div className="team-info-header">
                                        Ничьих: <span className="team-info-text">{team.drawsQnt}</span>
                                    </div>
                                    <div className="team-info-header">
                                        Голов забито: <span className="team-info-text">{team.scoredGoalsQnt}</span>
                                    </div>
                                    <div className="team-info-header">
                                        Голов пропущено: <span className="team-info-text">{team.consededGoalsQnt}</span>
                                    </div>
                                </div>
                                <div className="row team-desc-row">
                                    <div className="row team-info-text team-desc">
                                        {team.description}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        <div className="col-4 team-info-user-container">
                            <div className="team-info-user-absolute-container">
                                {
                                    teamUsers?.map((player) => (
                                        <div className="row m-0">
                                            <PlayerBlock info={player} />
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    }
                    <div className="col-3 h-100 p-0">
                        {isPart ? <MessagesBlock entityId={teamId}
                            entityType="team" />
                            : null}
                    </div>
                </div>
            </div>
        </div>
    );
}    