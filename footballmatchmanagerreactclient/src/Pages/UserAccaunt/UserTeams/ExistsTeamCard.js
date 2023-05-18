import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { HubConnectionBuilder } from "@microsoft/signalr";

import "./../../../css/Teams/TeamInfoCard.css";
import MessagesBlock from "./../Games/ViewGameCard/MessagesBlock";
import TeamParticipants from "./TeamParticipants";
import { Context } from "../../..";
import TeamCreatorButtons from "./TeamCreatorButtons";
import TeamParticipantButtons from "./TeamParticipantButtons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { TO_EDIT_TEAM } from "../../../Utilts/Consts";

export default function ExistsTeamCard(props) {

    const navigate = useNavigate();
    const location = useLocation();
    const { userContext } = useContext(Context);
    const [team, setTeam] = useState({});
    //const [teamUsers, setTeamUsers] = useState([]);
    /* Является ли пользователь организатором команды */
    const [isCreat, setIsCreat] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    /* Обновление участников команды */
    const [refreshTeamUsers, setRefreshTeamUsers] = useState(false);
    /* Соединение с хабом удаления */
    const deleteHubConnection = useRef(null);
    /*Айди организатора команды*/
    const [teamCreatorId, setTeamCreatorId] = useState();

    // ----------------------------------------------------------------------------------- //

    useEffect(() => {
        getTeamInfo(props.teamId)
        connectToDelete();

        return () => {
            if (deleteHubConnection.current) {
                deleteHubConnection.current.stop();
            }
        };

    }, [props.userTeams]);

    // ----------------------------------------------------------------------------------- //

    const connectToDelete = async () => {

        const hubDeleteConnection = new HubConnectionBuilder().withUrl("http://localhost:5004/team").build();

        hubDeleteConnection.on("refreshteam", () => {
            props.update();
        });

        hubDeleteConnection.on("refreshteamcard", () => {
            props.update();
        });

        await hubDeleteConnection.start();

        console.log('TEAMID');
        console.log(props.teamId);

        hubDeleteConnection.invoke("Connect", String(props.teamId));

        deleteHubConnection.current = hubDeleteConnection;


    }

    // ----------------------------------------------------------------------------------- //


    function getTeamInfo(teamId) {

        axios.get('http://localhost:5004/api/team/team/' + teamId, { withCredentials: true })
            .then((response) => {
                setTeam(response.data.currteam);
                setIsCreat(response.data.isCreat);
                setTeamCreatorId(response.data.creatorId);
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
    }

    // ----------------------------------------------------------------------------------- //

    function leaveTeam() {

        axios.delete('http://localhost:5004/api/team/leave-from-team/' + team.pkId, { withCredentials: true })
            .then((response) => {
                toast.success(response.data.message,
                    {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                        pauseOnFocusLoss: false
                    });
                //setTeamUsers(response.data.users);
                props.update();
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

    // ----------------------- Редактирование команды -------------------------- //

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
                                            : <TeamParticipantButtons
                                                isPart={true}
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
                        <div className="col-4 team-info-user-container">
                            <TeamParticipants teamId={team.pkId}
                                isCreat={isCreat}
                                teamCreatorId={teamCreatorId}
                                refresh={refreshTeamUsers}
                                deleteUserTeam={deleteUserTeam}
                            />
                        </div>
                        <div className="col-3 p-0 h-100">
                            <div className="row team-switch-cont">
                                <select className="form-select form-select-sm team-switch"
                                    onChange={e => getTeamInfo(e.target.value)}>
                                    {
                                        props.userTeams?.map((team) => (
                                            team.pkId === props.teamId ?
                                                <option selected value={team.pkId} >{team.name}</option>
                                                :
                                                <option value={team.pkId} >{team.name}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className="row team-mess-cont">
                                <MessagesBlock entityId={team.pkId}
                                    entityType="team" />
                            </div>
                        </div>
                    </div>
                </div>
                <Outlet />
            </div>
        );
    }
}