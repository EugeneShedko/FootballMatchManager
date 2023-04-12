
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../../../../index"
import { HubConnectionBuilder } from "@microsoft/signalr";

import PlayerBlock from "../../Players/ViewPlayers/PlayerBlock";
import MessagesBlock from "./../../Games/ViewGameCard/MessagesBlock";
import "./../../../../css/Teams/TeamInfoCard.css";

export default function TeamInfoCard(props) {

    const { user } = useContext(Context);
    const [team, setTeam] = useState({});
    const [teamUsers, setTeamUsers] = useState([]);
    const [isPart, setIsPart] = useState(false);

    // -------------------------------------------------------------------------------------------------------------------------- //

    useEffect(() => {

        axios.get('http://localhost:5004/api/team/team/' + props.teamId, { withCredentials: true })
            .then((response) => {
                setTeam(response.data.currteam);
                setIsPart(response.data.isPart);
            })
            .then(() => {
                axios.get('http://localhost:5004/api/team/team-users/' + props.teamId, { withCredentials: true })
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

        var conn = user.getNotifiHubConn;
        conn.invoke("RequestToAddTeam", );

        /*
        const data = new FormData();
        data.append("teamId", props.teamId);
        data.append("userId", user.getUserId);

        axios.post('http://localhost:5004/api/profile/addtoteam', data, { withCredentials: true })
            .then((response) => {
                setTeamUsers(response.data.users);
                setTeam(response.data.currteam);
                setIsPart(true);
                toast.success(response.data.message, {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000,
                    pauseOnFocusLoss: false
                });
            })
            .catch(userError => {
                if (userError.response) {
                    toast.error("Ошибка регистрации на матч",
                        {
                            position: toast.POSITION.TOP_CENTER,
                            autoClose: 2000,
                            pauseOnFocusLoss: false
                        });
                }
            });
    }
    */

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
                        <div className="row m-0 p-0">
                            <div className="col-6 m-0 p-0">
                                <div className="row m-0 p-0">
                                    <img className="team-image"
                                        src={"http://localhost:5004/" + team.image}
                                        alt=""
                                    />
                                </div>
                                {/* Может кнопки поместить в какой-нибудь контейнер */}
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
                    <div className="col-3 h-100 p-0">
                        <MessagesBlock gameId={props.gameId} />
                        {/* isPart ? <MessagesBlock gameId={props.gameId} /> : null */}
                    </div>
                </div>
            </div>
        </div>
    );
}    