
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../../../../index"
import { HubConnectionBuilder } from "@microsoft/signalr";

import MessagesBlock from "./../../Games/ViewGameCard/MessagesBlock";
import "./../../../../css/Teams/TeamInfoCard.css";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import TeamParticipants from "../../UserTeams/TeamParticipants";
import TeamCreatorButtons from "../../UserTeams/TeamCreatorButtons";
import TeamParticipantButtons from "../../UserTeams/TeamParticipantButtons";
import { TO_EDIT_TEAM, TO_TEAM_GAMES } from "../../../../Utilts/Consts";

export default function TeamInfoCard() {

    const { userContext } = useContext(Context);
    const navigate = useNavigate();
    const location = useLocation();
    const [teamId, setTeamId] = useState(parseInt(useParams().id));
    const [team, setTeam] = useState({});
    const [isPart, setIsPart] = useState(false);
    /* Является ли пользователь организатором команды */
    const [isCreat, setIsCreat] = useState(false);
    /* Обновление участников команды */
    const [refreshTeam, setRefreshTeam] = useState(false);
    /* Обновление участников команды */
    const [refreshTeamUsers, setRefreshTeamUsers] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    /* Соединение с хабом удаления */
    const deleteHubConnection = useRef(null);
    /*Айди организатора команды*/
    const [teamCreatorId, setTeamCreatorId] = useState();

    // -------------------------------------------------------------------------------------------------------------------------- //

    useEffect(() => {

        axios.get('http://localhost:5004/api/team/team/' + teamId, { withCredentials: true })
            .then((response) => {
                setTeam(response.data.currteam);
                setIsPart(response.data.isPart);
                setIsCreat(response.data.isCreat)
                setTeamCreatorId(response.data.creatorId);

                if (response.data.isPart)
                    connectToDelete();

                setIsLoading(true);
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

        return () => {
            if (deleteHubConnection.current) {
                deleteHubConnection.current.stop();
            }
        };

    }, [refreshTeam, location.state]);

    // ----------------------------------------------------------------------------------- //

    const connectToDelete = async () => {

        const hubDeleteConnection = new HubConnectionBuilder().withUrl("http://localhost:5004/team").build();

        hubDeleteConnection.on("refreshteam", () => {
            navigate(TO_TEAM_GAMES);
        });

        hubDeleteConnection.on("refreshteamcard", () => {
            setRefreshTeam(!refreshTeam);
        });

        await hubDeleteConnection.start();

        await hubDeleteConnection.invoke("Connect", String(teamId));

        deleteHubConnection.current = hubDeleteConnection;


    }


    // -------------------------------------------------------------------------------------------------------------------------- //

    function requestToAddTeam() {

        var conn = userContext.notificonn;
        conn.invoke("RequestToAddTeam", teamId);
    }

    // -------------------------------------------------------------------------------------------------------------------------- //

    function leaveTeam() {

        axios.delete('http://localhost:5004/api/team/leave-from-team/' + team.pkId, { withCredentials: true })
            .then((response) => {
                toast.success(response.data.message,
                    {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                        pauseOnFocusLoss: false
                    });

                setRefreshTeam(!refreshTeam);
            })
            .catch((error) => {
                if (error.response) {
                    toast.error(error.response.data.message,
                        {
                            position: toast.POSITION.TOP_CENTER,
                            autoClose: 2000,
                            pauseOnFocusLoss: false
                        });
                }
            });
    }

    // ----------------------- Удаление пользователя из команды ------------------------ //

    function deleteUserTeam(userId) {

        axios.delete('http://localhost:5004/api/team/delete-team-user/' + team.pkId + '/' + userId, { withCredentials: true })
            .then((response) => {

                setRefreshTeamUsers(!refreshTeamUsers);
                team.memberQnt = team.memberQnt - 1;

                /*
                var conn = userContext.notificonn;
                conn?.invoke("DeleteUserFromTeam", team.pkId, userId);
                */

                toast.success(response.data.message,
                    {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                        pauseOnFocusLoss: false
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

    // ------------------------ Редактирование команды  ------------------------------------------------------------------- //

    function editTeam() {
        navigate(location.pathname + TO_EDIT_TEAM, {
            state: {
                teamId: team.pkId,
                teamName: team.name,
                teamDesc: team.description,
                teamImage: team.image
            }
        });
    }

    // ----------------------- Удаление команды -------------------------------------- //

    function deleteTeam() {
        axios.delete('http://localhost:5004/api/team/delete-team/' + team.pkId, { withCredentials: true })
            .then((response) => {

                toast.success(response.data.message,
                    {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                        pauseOnFocusLoss: false
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

    // ------------------------------------------------------------------------------------ //

    if (isLoading) {
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
                                        <img className="team-imagee"
                                            src={"http://localhost:5004/" + team.image}
                                            alt=""
                                        />
                                    </div>
                                    <div className="row team-join-button-container">
                                        {isCreat ? <TeamCreatorButtons
                                            editTeam={editTeam}
                                            deleteTeam={deleteTeam}
                                        />
                                            :
                                            <TeamParticipantButtons
                                                isPart={isPart}
                                                requestToAddTeam={requestToAddTeam}
                                                leaveTeam={leaveTeam}
                                            />}
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
                                <TeamParticipants teamId={teamId}
                                    isCreat={isCreat}
                                    teamCreatorId={teamCreatorId}
                                    refresh={refreshTeamUsers}
                                    refreshTeam={refreshTeam}
                                    deleteUserTeam={deleteUserTeam}
                                />
                            </div>
                        }
                        <div className="col-3 h-100 p-0">
                            {isPart ? <MessagesBlock entityId={teamId}
                                entityType="team" />
                                : null}
                        </div>
                    </div>
                </div>
                <Outlet />
            </div>
        );
    }
}    